"use client";
import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProjectCards from "./projectCards";
import ActionButton from "@/app/component/floatingButton/actionButton";
import { fetcher } from "../services/projectAction";
import useSWR from "swr";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import { Project } from "../../project/interfaces/projectInterface";
import Chat from "../../chatbot/components/chat";
import { useRouter } from "next/navigation";
import ProjectFilters from "@/app/component/filters/projectFilters";
import { getStoredObj, setStorage, removeStorage } from "@/app/common/utils/storage";
import { Skeleton } from "@mui/material";

const ProjectList = () => {
  const { canAccess } = useUserPermission();
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: projects, isLoading: isLoadingProjects } = useSWR("fetch-projects", fetcher);
  const isLoading = !projects;

  const router = useRouter();
  const FILTER_STORAGE_KEY = "projectFilters";
  const storedFilters = getStoredObj(FILTER_STORAGE_KEY) || {};
  const [statusFilter, setStatusFilter] = useState<string[]>(storedFilters.statusFilter || []);
  const [userFilter, setUserFilter] = useState<string[]>(storedFilters.userFilter || []);
  const allUsers: string[] = Array.from(
    new Set(
      projects?.flatMap((project: Project) =>
        project.users?.map((u: { id: string; name: string; user_id: string }) => u.name)
      ) ?? []
    )
  ) as string[];
  const allStatuses = Array.from(
    new Set(projects?.map((project: Project) => project.status) ?? [])
  ) as string[];

  let filteredProjects: Project[] = [];
  if (projects) {
    filteredProjects = projects.filter((project: Project) => {
      const nameMatches = project.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatches = statusFilter.length === 0 || statusFilter.includes(project.status);
      const userMatches =
        userFilter.length === 0 ||
        project.users?.some(
          (user: { name?: string }) => user.name && userFilter.includes(user.name)
        );
      return nameMatches && statusMatches && userMatches;
    });
  }
  const updateFilter = (
    key: "statusFilter" | "userFilter",
    value: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter(value);
    const existing = getStoredObj(FILTER_STORAGE_KEY) || {};
    setStorage(FILTER_STORAGE_KEY, { ...existing, [key]: value });
  };
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setUserFilter([]);
    removeStorage(FILTER_STORAGE_KEY);
  };
  const filtersApplied =
    searchTerm.trim().length > 0 || statusFilter.length > 0 || userFilter.length > 0;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)",
        p: 3
      }}
    >
      <Box mb={3}>
        <Stack direction="row" spacing={2} alignItems="flex-start" flexWrap="wrap" flexGrow={1}>
          <ProjectFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            userFilter={userFilter}
            allStatuses={allStatuses}
            allUsers={allUsers}
            onStatusChange={(val) => updateFilter("statusFilter", val, setStatusFilter)}
            onUserChange={(val) => updateFilter("userFilter", val, setUserFilter)}
            onClearFilters={clearFilters}
            filtersApplied={filtersApplied}
            loading={isLoadingProjects}
          />
        </Stack>
      </Box>
      <ProjectCards projects={filteredProjects} loading={isLoadingProjects} />

      {canAccess(APPLICATIONS.CHATBOT, ACTIONS.CREATE) && <Chat />}
      {canAccess(APPLICATIONS.PROJECT, ACTIONS.CREATE) && (
        <ActionButton
          label={transproject("createnewproject")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => router.push("/project/createProject")}
        />
      )}
    </Box>
  );
};

export default ProjectList;

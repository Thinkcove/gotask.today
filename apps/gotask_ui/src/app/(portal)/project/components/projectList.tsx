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
import SearchBar from "@/app/component/searchBar/searchBar";
import { Project } from "../../project/interfaces/projectInterface";
import Chat from "../../chatbot/components/chat";
import { useRouter } from "next/navigation";
import ProjectFilters from "@/app/component/filters/projectFilters";
import { getStoredObj, setStorage } from "@/app/common/utils/storage";

const ProjectList = () => {
  const { canAccess } = useUserPermission();
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: projects } = useSWR("fetch-projects", fetcher);
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
        <Stack direction="row" spacing={2} alignItems="flex-start" flexWrap="wrap">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            sx={{ width: 300 }}
            placeholder={transproject("searchplaceholder")}
          />
          <ProjectFilters
            statusFilter={statusFilter}
            userFilter={userFilter}
            allStatuses={allStatuses}
            allUsers={allUsers}
            onStatusChange={(val) => updateFilter("statusFilter", val, setStatusFilter)}
            onUserChange={(val) => updateFilter("userFilter", val, setUserFilter)}
          />
        </Stack>
      </Box>

      <ProjectCards projects={filteredProjects} />

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

"use client";
import React, { useState, useMemo } from "react";
import { Box, Grid, BoxProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateProject from "./createProject";
import ProjectCards from "./projectCards";
import ActionButton from "@/app/component/floatingButton/actionButton";
import { fetchFilteredProjects } from "../services/projectAction";
import useSWR from "swr";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import SearchBar from "@/app/component/searchBar/searchBar";
import { Project } from "../../task/interface/taskInterface";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectFilters from "@/app/component/filters/projectFilters";

interface User {
  id: string;
  name: string;
}

interface ExtendedProject extends Project {
  users?: User[];
}

const ProjectList = () => {
  const { canAccess } = useUserPermission();
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get filters from URL, memoized
  const statusFilter = useMemo(() => searchParams.get("status")?.split(",") || [], [searchParams]);
  const userFilter = useMemo(() => searchParams.get("user_id")?.split(",") || [], [searchParams]);
  const searchTerm = searchParams.get("search") || "";

  // Compose SWR key from filters
  const swrKey = ["fetch-projects", statusFilter.join(","), userFilter.join(",")];

  const { data: projects, mutate: ProjectUpdate, isLoading } = useSWR(
    swrKey,
    () => fetchFilteredProjects({ status: statusFilter, user_name: userFilter }),
    { revalidateOnFocus: false }
  );

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("search", value);
    else params.delete("search");
    router.push(`?${params.toString()}`);
  };

  const handleStatusChange = (selected: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selected.length) params.set("status", selected.join(","));
    else params.delete("status");
    router.push(`?${params.toString()}`);
  };

  const handleUserChange = (selectedUserNames: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    const selectedUserIds = selectedUserNames.map(userName => {
      const user = userOptions.find(option => option.name === userName);
      return user ? user.id : userName;
    });

    if (selectedUserIds.length) params.set("user_id", selectedUserIds.join(","));
    else params.delete("user_id");

    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push("?");
  };

  const filteredProjects =
    projects?.filter((project: ExtendedProject) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const userOptions = useMemo(() => {
    const usersMap = new Map<string, User>();

    projects?.forEach((project: ExtendedProject) => {
      project.users?.forEach((user: User) => {
        if (!usersMap.has(user.id)) {
          usersMap.set(user.id, { id: user.id, name: user.name });
        }
      });
    });

    return Array.from(usersMap.values());
  }, [projects]);

  const selectedUserNames = useMemo(() => {
    return userFilter.map(userId => {
      const user = userOptions.find(option => option.id === userId);
      return user ? user.name : userId;
    });
  }, [userFilter, userOptions]);

  if (isLoading) {
    return <Box p={3}>Loading projects...</Box>;
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)",
        p: 3,
      } as BoxProps}
    >
      <CreateProject
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={ProjectUpdate}
      />

      {/* Search Bar */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={4}>
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: "100%" }}
            placeholder={transproject("searchplaceholder")}
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <ProjectFilters
            statusFilter={statusFilter}
            userFilter={selectedUserNames}
            onStatusChange={handleStatusChange}
            onUserChange={handleUserChange}
            onClearFilters={handleClearFilters}
            userOptions={userOptions.map(user => user.name)}
          />
        </Grid>
      </Grid>

      {/* Project Cards */}
      <Box>
        <ProjectCards projects={filteredProjects} />
      </Box>

      {/* Floating Add Button */}
      {canAccess(APPLICATIONS.PROJECT, ACTIONS.CREATE) && (
        <ActionButton
          label={transproject("createnewproject")}
          icon={<AddIcon sx={{ color: "white" }} />}
          onClick={() => setIsModalOpen(true)}
        />
      )}
    </Box>
  );
};

export default ProjectList;

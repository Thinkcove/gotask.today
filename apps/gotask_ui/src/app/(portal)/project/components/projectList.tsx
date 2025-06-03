"use client";
import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
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
import ProjectFilters from "@/app/component/filters/ProjectFilters";
import { Project } from "../../task/interface/taskInterface";
import { useRouter, useSearchParams } from "next/navigation";

const ProjectList = () => {
  const { canAccess } = useUserPermission();
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get filters from URL
  const statusFilter = searchParams.get("status")?.split(",") || [];
  const userFilter = searchParams.get("user_id")?.split(",") || [];
  const searchTerm = searchParams.get("search") || "";

  // Compose SWR key from filters
  const swrKey = ["fetch-projects", statusFilter.join(","), userFilter.join(",")];

  const { data: projects, mutate: ProjectUpdate, isLoading } = useSWR(
    swrKey,
    () => fetchFilteredProjects({ status: statusFilter, user_id: userFilter }),
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

  const handleUserChange = (selected: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selected.length) params.set("user_id", selected.join(","));
    else params.delete("user_id");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push("?");
  };

  const filteredProjects =
    projects?.filter((project: Project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Replace with dynamic user options later
  const userOptions = [
    "9abe5e92-0a8a-40b8-8531-bcb73f8f1c4f",
    "some-other-user-id",
  ];

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)",
        p: 3,
      }}
    >
      <CreateProject
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={ProjectUpdate}
      />

      {/* Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: "100%" }}
            placeholder={transproject("searchplaceholder")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ProjectFilters
            statusFilter={statusFilter}
            userFilter={userFilter}
            onStatusChange={handleStatusChange}
            onUserChange={handleUserChange}
            onClearFilters={handleClearFilters}
            userOptions={userOptions}
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

"use client";
import React, { useState } from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateProject from "./createProject";
import ProjectCards from "./projectCards";
import ActionButton from "@/app/component/floatingButton/actionButton";
import { fetcher } from "../services/projectAction";
import useSWR from "swr";

const ProjectList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: projects, error, mutate: ProjectUpdate } = useSWR("fetch-projects", fetcher);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)"
      }}
    >
      <CreateProject
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mutate={ProjectUpdate}
      />

      <ProjectCards projects={projects} error={error} />

      {/* Add Task Button */}
      <ActionButton
        label="Create New Projet"
        icon={<AddIcon sx={{ color: "white" }} />}
        onClick={() => setIsModalOpen(true)}
      />
    </Box>
  );
};

export default ProjectList;

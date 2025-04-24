"use client";
import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateProject from "./createProject";
import ProjectCards from "./projectCards";
import ActionButton from "@/app/component/floatingButton/actionButton";

const ProjectList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)"
      }}
    >
      <CreateProject open={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <ProjectCards />

      {/* Add Task Button */}
      <ActionButton
        label="Create New Task"
        icon={<AddIcon sx={{color:'white'}}/>}
        onClick={() => setIsModalOpen(true)}
      />
    </Box>
  );
};

export default ProjectList;

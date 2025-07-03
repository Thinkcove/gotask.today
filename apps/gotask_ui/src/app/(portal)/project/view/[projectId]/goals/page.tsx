"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import ProjectGoalList from "./components/projectGoalList";
import { useAllProjects } from "@/app/(portal)/task/service/taskAction";
import { useParams } from "next/navigation";

const page = () => {
  const { projectId } = useParams();

  const projectID = projectId as string;

  const { getAllProjects } = useAllProjects();

  const currentProject = getAllProjects?.find(
    (project: { id: string }) => project.id === projectID
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        m: 0,
        p: 0,
        overflow: "hidden"
      }}
    >
      <ModuleHeader name={currentProject?.name} />

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <ProjectGoalList />
      </Box>
    </Box>
  );
};

export default page;

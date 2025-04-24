"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";
import ProjectDetail from "./projectDetail";

const ViewAction: React.FC = () => {
  const { projectId } = useParams();
  const { data, mutate: UpdateData } = useSWR(`${env.API_BASE_URL}/getProjectById/${projectId}`, {
    revalidateOnFocus: false
  });
  const selectedTask = data?.data || null;

  return selectedTask ? (
    <ProjectDetail project={selectedTask} />
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
};

export default ViewAction;

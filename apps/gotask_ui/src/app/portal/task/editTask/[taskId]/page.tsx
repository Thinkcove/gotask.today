"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import EditTask from "./editTask";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";

const EditAction: React.FC = () => {
  const { taskId } = useParams();
  const { data, mutate: UpdateData } = useSWR(
    `${env.API_BASE_URL}/getTaskById/${taskId}`,
    {
      revalidateOnFocus: false,
    }
  );
  const selectedTask = data?.data || null;

  return selectedTask ? (
    <EditTask data={selectedTask} mutate={UpdateData} />
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default EditAction;

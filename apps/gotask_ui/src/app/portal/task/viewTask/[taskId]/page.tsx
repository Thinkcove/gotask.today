"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";
import { fetchToken } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";
import TaskDetail from "./taskDetail";

const ViewAction: React.FC = () => {
  const { taskId } = useParams();
  const token = fetchToken();
  const { data } = useSWR(
    token ? `${env.API_BASE_URL}/getTaskById/${taskId}` : null,
    (url) => getData(url, token ?? undefined),
    { revalidateOnFocus: false }
  );
  const selectedTask = data?.data || null;

  return selectedTask ? (
    <TaskDetail task={selectedTask} />
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
};

export default ViewAction;

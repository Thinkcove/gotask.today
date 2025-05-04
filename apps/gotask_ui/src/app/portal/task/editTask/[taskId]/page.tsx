"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import EditTask from "./editTask";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";
import { fetchToken } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";

const EditAction: React.FC = () => {
  const { taskId } = useParams();
  const token = fetchToken();

  const { data, mutate: UpdateData } = useSWR(
    token ? `${env.API_BASE_URL}/getTaskById/${taskId}` : null,
    (url) => getData(url, token ?? undefined),
    { revalidateOnFocus: false }
  );
  const selectedTask = data?.data || null;

  return selectedTask ? (
    <EditTask data={selectedTask} mutate={UpdateData} />
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
};

export default EditAction;

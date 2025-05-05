"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";
import ProjectDetail from "./projectDetail";
import { getData } from "@/app/common/utils/apiData";
import { fetchToken } from "@/app/common/utils/authToken";

const ViewAction: React.FC = () => {
  const { projectId } = useParams();
  const token = fetchToken();

  const { data, mutate: UpdateData } = useSWR(
    token ? `${env.API_BASE_URL}/getProjectById/${projectId}` : null,
    (url) => getData(url, token ?? undefined),
    { revalidateOnFocus: false }
  );
  const selectedTask = data?.data || null;

  return selectedTask ? (
    <ProjectDetail project={selectedTask} mutate={UpdateData} />
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
};

export default ViewAction;

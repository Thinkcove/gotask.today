"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";
import UserDetail from "./userDetail";
import { fetchToken } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";

const ViewAction: React.FC = () => {
  const { userId } = useParams();
  const token = fetchToken();
  const { data, mutate } = useSWR(
    token ? `${env.API_BASE_URL}/getUserById/${userId}` : null,
    (url) => getData(url, token ?? undefined),
    { revalidateOnFocus: false }
  );
  const selectedTask = data?.data || null;

  return selectedTask ? (
    <UserDetail user={selectedTask} mutate={mutate} />
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
};

export default ViewAction;

"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";
import UserDetail from "./userDetail";

const ViewAction: React.FC = () => {
  const { userId } = useParams();
  const { data } = useSWR(`${env.API_BASE_URL}/getUserById/${userId}`, {
    revalidateOnFocus: false
  });
  const selectedTask = data?.data || null;

  return selectedTask ? (
    <UserDetail user={selectedTask} />
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
};

export default ViewAction;

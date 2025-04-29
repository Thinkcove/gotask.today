"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";
import RoleDetail from "./roleDetail";

const ViewAction: React.FC = () => {
  const { roleId } = useParams();
  const { data, mutate } = useSWR(`${env.API_BASE_URL}/roles/${roleId}`, {
    revalidateOnFocus: false
  });
  console.log("data view ", data);
  const selectedTask = data || null;

  return selectedTask ? (
    <RoleDetail role={selectedTask} mutate={mutate} />
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
};

export default ViewAction;

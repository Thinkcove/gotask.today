"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";
import OrgDetail from "./orgDetail";

const ViewAction: React.FC = () => {
  const { orgId } = useParams();
  const { data, mutate } = useSWR(`${env.API_BASE_URL}/getOrgById/${orgId}`, {
    revalidateOnFocus: false
  });
  const selectedTask = data?.data || null;

  return selectedTask ? (
    <OrgDetail org={selectedTask} mutate={mutate} />
  ) : (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
};

export default ViewAction;

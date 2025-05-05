"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";
import RoleDetail from "./roleDetail";
import { getData } from "@/app/common/utils/apiData";
import { fetchToken } from "@/app/common/utils/authToken";

const ViewAction: React.FC = () => {
  const { roleId } = useParams();
  const token = fetchToken();
  const { data, mutate } = useSWR(
    token ? `${env.API_BASE_URL}/roles/${roleId}` : null,
    (url) => getData(url, token ?? undefined),
    { revalidateOnFocus: false }
  );
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

"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { CircularProgress, Box } from "@mui/material";
import OrgDetail from "./orgDetail";
import { getData } from "@/app/common/utils/apiData";
import { fetchToken } from "@/app/common/utils/authToken";

const ViewAction: React.FC = () => {
  const { orgId } = useParams();
  const token = fetchToken();
  const { data, mutate } = useSWR(
    token ? `${env.API_BASE_URL}/getOrgById/${orgId}` : null,
    (url) => getData(url, token ?? undefined),
    { revalidateOnFocus: false }
  );
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

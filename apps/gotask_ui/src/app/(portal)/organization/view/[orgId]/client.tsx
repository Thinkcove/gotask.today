"use client";

import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import OrgDetail from "./orgDetail";
import { getData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";

const fetchOrg = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const ViewAction: React.FC = () => {
  const { orgId } = useParams();
  const url = `${env.API_BASE_URL}/getOrgById/${orgId}`;

  const { data, mutate, error, isLoading } = useSWR(orgId ? url : null, fetchOrg, {
    revalidateOnFocus: false
  });

  const selectedOrg = data?.data || null;

  return selectedOrg ? (
    <OrgDetail org={selectedOrg} mutate={mutate} />
  ) : error ? (
    <p>Error loading organization.</p>
  ) : isLoading ? (
    <p>Loading...</p>
  ) : null;
};

export default ViewAction;

"use client";

import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";
import OrgDetail from "../[orgId]/orgDetail";

const fetchOrg = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const OrgViewClient: React.FC = () => {
  const { orgId } = useParams();
  const url = `${env.API_BASE_URL}/getOrgById/${orgId}`;
  const { data, mutate } = useSWR(orgId ? url : null, fetchOrg, {
    revalidateOnFocus: false
  });

  const selectedOrg = data?.data || null;

  return selectedOrg ? <OrgDetail org={selectedOrg} mutate={mutate} /> : null;
};

export default OrgViewClient;

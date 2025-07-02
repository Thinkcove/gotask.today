"use client";

import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import RoleDetail from "./roleDetail";
import { getData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";

const fetchRole = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const ViewAction: React.FC = () => {
  const { roleId } = useParams();
  const url = `${env.API_BASE_URL}/roles/${roleId}`;

  const { data, mutate } = useSWR(roleId ? url : null, fetchRole, {
    revalidateOnFocus: false
  });

  const selectedRole = data || null;
  return selectedRole && <RoleDetail role={selectedRole} mutate={mutate} />;
};

export default ViewAction;

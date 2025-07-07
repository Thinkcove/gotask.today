"use client";

import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { getData } from "@/app/common/utils/apiData";
import { withAuth } from "@/app/common/utils/authToken";
import UserDetail from "./userDetail";

const fetchUser = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const UserViewClient: React.FC = () => {
  const { userId } = useParams();
  const url = `${env.API_BASE_URL}/getUserById/${userId}`;
  const { data, mutate } = useSWR(userId ? url : null, fetchUser, {
    revalidateOnFocus: false
  });

  const selectedUser = data?.data || null;

  return selectedUser ? <UserDetail user={selectedUser} mutate={mutate} /> : null;
};

export default UserViewClient;

"use client";
import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import env from "@/app/common/env";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";
import EditUser from "./editUser";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const fetchUser = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const EditUserPage: React.FC = () => {
  const { userId } = useParams();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);

  const url = `${env.API_BASE_URL}/getUserById/${userId}`;
  const { data, mutate } = useSWR(userId ? url : null, fetchUser, {
    revalidateOnFocus: false
  });

  const user = data?.data || null;

  return user ? (
    <>
      <ModuleHeader name={transuser("edituser")} />
      <EditUser
        data={user}
        open={true}
        onClose={() => {}}
        userID={userId as string}
        mutate={mutate}
      />
    </>
  ) : null;
};

export default EditUserPage;

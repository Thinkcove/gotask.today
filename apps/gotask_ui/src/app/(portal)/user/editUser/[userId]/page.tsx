"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import env from "@/app/common/env";
import { withAuth } from "@/app/common/utils/authToken";
import { getData } from "@/app/common/utils/apiData";
import { IUserField, User } from "../../interfaces/userInterface";
import EditUser from "./editUser";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { CircularProgress } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const fetchUser = async (url: string) => {
  return await withAuth(async (token: string) => {
    return await getData(url, token);
  });
};

const EditUserPage = () => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const { userId } = useParams();
  const user_id = userId as string;
  const url = `${env.API_BASE_URL}/getUserById/${user_id}`;

  const { data, error, isLoading, mutate } = useSWR(userId ? url : null, fetchUser, {
    revalidateOnFocus: false
  });

  const selectedUser = data?.data || null;

  const mapUserToUserField = (user: User): IUserField => ({
    first_name: user.first_name,
    last_name: user.last_name,
    name: user.name,
    status: user.status,
    mobile_no: user.mobile_no,
    joined_date: user.joined_date,
    emp_id: user.emp_id,
    organization: user.organization,
    roleId: user.roleId._id,
    user_id: user.user_id
  });

  return (
    <>
      <ModuleHeader name={transuser("edituser")} />

      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <Typography color="error">{transuser("failedfetch")}</Typography>
        </Box>
      )}

      {selectedUser && !isLoading && !error && (
        <EditUser data={mapUserToUserField(selectedUser)} mutate={mutate} userID={user_id} />
      )}
    </>
  );
};

export default EditUserPage;

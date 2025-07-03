"use client";

import React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetchTemplates } from "../../../service/templateAction";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ModuleHeader from "@/app/component/header/moduleHeader";
import AddTemplate from "./addTemplate";
import { getUserById } from "@/app/(portal)/user/services/userAction";
import { CircularProgress, Typography, Box } from "@mui/material";

const Page = () => {
  const params = useParams();
  const username = params?.id as string;
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const { data: templates, mutate, error: templatesError } = useSWR("templates", fetchTemplates);
  const { data: user, error: userError } = useSWR(username ? `user-${username}` : null, () =>
    getUserById(username)
  );

  if (templatesError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{transkpi("errorLoadingTemplates")}</Typography>
      </Box>
    );
  }

  if (userError) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{transkpi("errorInvalidUsername", { username })}</Typography>
      </Box>
    );
  }

  if (!templates || !username || !user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <ModuleHeader name={transkpi("assignatemplate")} />
      <AddTemplate templates={templates} userId={user.id} mutate={mutate} user={user} />
    </>
  );
};

export default Page;

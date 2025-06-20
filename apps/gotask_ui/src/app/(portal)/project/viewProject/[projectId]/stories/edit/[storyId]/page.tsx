"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import EditStoryForm from "../../../../../../projectStory/components/EditStoryForm";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const EditStoryPage = () => {
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS); // 'Projects'

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        m: 0,
        p: 0,
        overflow: "hidden"
      }}
    >
      <ModuleHeader name={t("Stories.editStory")} />
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <EditStoryForm />
      </Box>
    </Box>
  );
};

export default EditStoryPage;

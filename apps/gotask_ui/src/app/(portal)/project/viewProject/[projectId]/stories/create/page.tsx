"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import CreateStoryForm from "../../../../../projectStory/components/CreateStoryForm";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const CreateStoryPage = () => {
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

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
      <ModuleHeader name={t("Stories.createStory")} />
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <CreateStoryForm />
      </Box>
    </Box>
  );
};

export default CreateStoryPage;

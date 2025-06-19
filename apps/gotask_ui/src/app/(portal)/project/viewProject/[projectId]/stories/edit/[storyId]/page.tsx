"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import EditStoryForm from "../../../../../../projectStory/components/EditStoryForm";
import { useTranslations } from "next-intl";

const EditStoryPage = () => {
  const t = useTranslations();

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
      <ModuleHeader name={t("Projects.Stories.editStory")} />
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <EditStoryForm />
      </Box>
    </Box>
  );
};

export default EditStoryPage;

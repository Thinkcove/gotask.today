"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";

import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ProjectStoryDetail from "../../../components/ProjectStoryDetail";

const StoryDetailPage = () => {
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
      {/* Header Section */}
      <ModuleHeader name={t("Stories.projectStories")} />

      {/* Content Section */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <ProjectStoryDetail />
      </Box>
    </Box>
  );
};

export default StoryDetailPage;

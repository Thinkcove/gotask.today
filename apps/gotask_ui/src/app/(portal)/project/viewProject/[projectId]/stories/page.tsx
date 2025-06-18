"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import StoryList from "@/app/(portal)/projectStory/components/StoryList";
import { useTranslations } from "next-intl";

const StoriesPage = () => {
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
      {/* Header Section */}
      <ModuleHeader name={t("Projects.Stories.projectStories")} />

      {/* Content Section */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <StoryList />
      </Box>
    </Box>
  );
};

export default StoriesPage;

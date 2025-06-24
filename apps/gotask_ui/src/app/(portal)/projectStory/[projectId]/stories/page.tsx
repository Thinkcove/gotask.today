"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import StoryList from "@/app/(portal)/projectStory/components/StoryList";
import { useTranslations } from "next-intl";

const StoriesPage = () => {
  const t = useTranslations("Projects.Stories");

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
      <ModuleHeader name={t("projectStories")} />

      {/* Content Section */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <StoryList />
      </Box>
    </Box>
  );
};

export default StoriesPage;

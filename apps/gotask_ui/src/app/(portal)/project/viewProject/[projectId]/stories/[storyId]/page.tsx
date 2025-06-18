// /app/(portal)/project/[projectId]/stories/[storyId]/page.tsx

"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import ProjectStoryDetail from "../../../../../projectStory/components/ProjectStoryDetail";
import { useTranslations } from "next-intl";

const StoryDetailPage = () => {
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
        <ProjectStoryDetail />
      </Box>
    </Box>
  );
};

export default StoryDetailPage;

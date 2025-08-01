"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import StoryList from "@/app/(portal)/projectStory/components/StoryList";
import { useTranslations } from "next-intl";

const StoriesPage = () => {
  const t = useTranslations("Projects.Stories");
  const [projectName, setProjectName] = useState("");

  const suffixToday = t("suffixtoday");
  const cleanedName = projectName.replace(new RegExp(`${suffixToday}$`, "i"), "").trim();

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
      {/* Header */}
      <ModuleHeader name={cleanedName ? `${cleanedName} ${t("stories")}` : t("projectStories")} />
      {/* Story List */}
      <StoryList onProjectNameLoad={setProjectName} />
    </Box>
  );
};

export default StoriesPage;

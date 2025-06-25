"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import StoryList from "@/app/(portal)/projectStory/components/StoryList";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

const StoriesPage = () => {
  const t = useTranslations("Projects.Stories");
  const searchParams = useSearchParams();

  const initialProjectName = searchParams.get("name") || "";
  const [projectName, setProjectName] = useState(initialProjectName);

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

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <StoryList onProjectNameFetch={(name) => setProjectName(name)} />
      </Box>
    </Box>
  );
};

export default StoriesPage;

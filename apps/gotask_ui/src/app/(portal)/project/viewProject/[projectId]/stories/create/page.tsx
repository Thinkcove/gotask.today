// app/(portal)/project/[projectId]/stories/create/page.tsx

"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import CreateStoryForm from "../../../../../projectStory/components/CreateStoryForm";
import { useTranslations } from "next-intl";

const CreateStoryPage = () => {
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
      <ModuleHeader name={t("Projects.Stories.createStory")} />
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        <CreateStoryForm />
      </Box>
    </Box>
  );
};

export default CreateStoryPage;

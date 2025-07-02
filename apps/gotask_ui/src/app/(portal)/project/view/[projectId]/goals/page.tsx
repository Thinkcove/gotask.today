"use client";

import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import ProjectGoalList from "./components/projectGoalList";
import { LOCALIZATION } from "@/app/common/constants/localization";

const StoriesPage = () => {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);

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
      <ModuleHeader name={transGoal("goal")} />

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <ProjectGoalList />
      </Box>
    </Box>
  );
};

export default StoriesPage;

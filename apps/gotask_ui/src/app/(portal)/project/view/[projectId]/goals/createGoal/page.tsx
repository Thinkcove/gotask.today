"use client";

import React from "react";
import { Box } from "@mui/material";
import CreateGoal from "@/app/(portal)/project/view/[projectId]/goals/createGoal/components/createGoal";

const page = () => {
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
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <CreateGoal />
      </Box>
    </Box>
  );
};

export default page;

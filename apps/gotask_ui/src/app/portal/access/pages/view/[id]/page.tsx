"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import AccessView from "../../../components/AccessView";

const AccessViewPage = () => {
  return (
    <Box className="flex flex-col h-screen w-full m-0 p-0 overflow-hidden">
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#741B92",
          color: "white",
          py: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, textTransform: "capitalize" }}>
          View Access
        </Typography>
      </Box>

      {/* Content */}
      <Box className="flex-1 overflow-auto">
        <AccessView />
      </Box>
    </Box>
  );
};

export default AccessViewPage;

"use client";

import { Box, Typography } from "@mui/material";
import React from "react";
import AccessView from "../../../components/AccessView";

const AccessViewPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        m: 0,
        p: 0,
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: "#741B92",
          color: "white",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
            textTransform: "capitalize",
          }}
        >
          View Access
        </Typography>
      </Box>

      {/* Content Section */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <AccessView />
      </Box>
    </Box>
  );
};

export default AccessViewPage;
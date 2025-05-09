"use client";

import { Box, Typography } from "@mui/material";
import React from "react";
import AccessView from "../../../components/AccessView";
import { useTranslations } from "next-intl"; 
import { LOCALIZATION } from "../../../../../common/constants/localization"; 

const AccessViewPage = () => {
  const transAccess = useTranslations(LOCALIZATION.TRANSITION.ACCESS); 

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
          {transAccess("viewdetail")} {/* Using translation key from en.json */}
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

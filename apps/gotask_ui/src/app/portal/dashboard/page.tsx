"use client";
import { Box, Typography } from "@mui/material";
import React from "react";
import DashboardLayout from "./components/dashboardLayout";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const page = () => {
  const transdashboard = useTranslations(LOCALIZATION.TRANSITION.DASHBOARD);
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#741B92", // Solid color for a bold look
          color: "white",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
            textTransform: "capitalize"
          }}
        >
          {transdashboard("dashboard")}
        </Typography>
      </Box>
      <DashboardLayout />
    </Box>
  );
};

export default page;

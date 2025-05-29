"use client";
import { Box } from "@mui/material";
import React from "react";
import DashboardLayout from "./components/dashboardLayout";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import ModuleHeader from "@/app/component/appBar/moduleHeader";

const Page = () => {
  const transdashboard = useTranslations(LOCALIZATION.TRANSITION.DASHBOARD);
  return (
    <Box>
      <ModuleHeader name={transdashboard("dashboard")} />
      <DashboardLayout />
    </Box>
  );
};

export default Page;

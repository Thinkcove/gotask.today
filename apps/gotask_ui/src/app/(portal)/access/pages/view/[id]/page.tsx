"use client";
import { Box } from "@mui/material";
import React from "react";
import AccessView from "../../../components/AccessView";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "../../../../../common/constants/localization";
import ModuleHeader from "@/app/component/appBar/moduleHeader";

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
        overflow: "hidden"
      }}
    >
      {/* Header Section */}
      <ModuleHeader name={transAccess("viewdetail")} />

      {/* Content Section */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <AccessView />
      </Box>
    </Box>
  );
};

export default AccessViewPage;

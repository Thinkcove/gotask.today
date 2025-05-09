"use client";

import { Box } from "@mui/material";
import React from "react";
import AccessCreateForm from "../../components/AccessCreateForm";
import ModuleHeader from "../../../../component/appBar/moduleHeader";
import { LOCALIZATION } from "../../../../common/constants/localization";
import { useTranslations } from "next-intl";

const AccessCreatePage = () => {
  const t = useTranslations(LOCALIZATION.TRANSITION.ACCESS);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        m: 0,
        p: 0,
        overflow: "hidden", // Prevent scrolling
      }}
    >
      {/* Header Section */}
      <ModuleHeader name={t("createaccessnew")} />

      {/* Content Section */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
        <AccessCreateForm />
      </Box>
    </Box>
  );
};

export default AccessCreatePage;

"use client";

import { Box } from "@mui/material";
import React from "react";
import AccessCreateForm from "../../components/accessCreateForm";
import ModuleHeader from "../../../../component/header/moduleHeader";
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
        overflow: "hidden" // Prevent scroll on whole page
      }}
    >
      {/* Header Section */}
      <Box sx={{ flexShrink: 0 }}>
        <ModuleHeader name={t("createaccessnew")} />
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden", // No page scroll here
          p: 3
        }}
      >
        <AccessCreateForm />
      </Box>
    </Box>
  );
};

export default AccessCreatePage;

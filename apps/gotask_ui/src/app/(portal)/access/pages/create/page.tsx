"use client";

import { Box } from "@mui/material";
import React from "react";
import AccessCreateForm from "../../components/AccessCreateForm";
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
      <ModuleHeader name={t("createaccessnew")} />

      {/* Content Section */}
      <Box sx={{ flex: 1, overflow: "hidden", p: 2 }}>
        <AccessCreateForm />
      </Box>
    </Box>
  );
};

export default AccessCreatePage;

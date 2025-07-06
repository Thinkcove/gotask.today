"use client";
import React from "react";
import { Box } from "@mui/material";
import ModuleHeader from "@/app/component/header/moduleHeader";
import PermissionList from "./components/permissionList";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const Page = () => {
  const transpermishion = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

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
      <ModuleHeader name={transpermishion("permission")} />

      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <PermissionList />
      </Box>
    </Box>
  );
};

export default Page;

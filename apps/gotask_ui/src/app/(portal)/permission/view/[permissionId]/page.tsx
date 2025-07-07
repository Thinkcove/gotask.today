"use client";

import React from "react";
import { Box } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { usePermissionById } from "../../services/permissionAction";
import PermissionDetails from "./components/permishionView";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const PermissionViewPage: React.FC = () => {
  const transpermission = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

  const router = useRouter();
  const params = useParams();
  const permissionId = params.permissionId as string;

  const { permission } = usePermissionById(permissionId);
  
  const handleBack = () => {
    router.back();
  };

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
      <ModuleHeader name={transpermission("permission")} />
      <Box sx={{ p: 4 }}>
        <PermissionDetails permission={permission} onBack={handleBack} />
      </Box>
    </Box>
  );
};

export default PermissionViewPage;

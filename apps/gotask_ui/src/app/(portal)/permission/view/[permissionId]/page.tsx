"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { usePermissionById } from "../../services/permissionAction";
import PermissionDetails from "./conponents/permishionView";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const PermissionViewPage: React.FC = () => {
  const transpermishion = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

  const router = useRouter();
  const params = useParams();
  const permissionId = params.permissionId as string;

  console.log("Permission ID from params:", permissionId);

  const { permission, isLoading, isError } = usePermissionById(permissionId);

  console.log("permission view", permission);

  const handleBack = () => {
    router.back();
  };

  // if (isLoading) {
  //   return (
  //     <Box
  //       sx={{
  //         minHeight: "100vh",
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
  //       }}
  //     >
  //       <CircularProgress size={50} thickness={4} />
  //     </Box>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <Box sx={{ p: 4 }}>
  //       <div>Error loading permission details</div>
  //     </Box>
  //   );
  // }

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
      <Box sx={{ p: 4 }}>
        <PermissionDetails permission={permission} onBack={handleBack} />
      </Box>
    </Box>
  );
};

export default PermissionViewPage;

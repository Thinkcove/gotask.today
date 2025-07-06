"use client";
import React from "react";
import { Box } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { usePermissionById } from "../../services/permissionAction";
import PermissionLoadingState from "../../components/permissionLoadingState";
import PermissionDetails from "./conponents/permishionView";

const ViewPermission: React.FC = () => {
  const transpermishion = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);
  const router = useRouter();
  const { permishionId } = useParams();

  console.log("permishionId", permishionId);

  const permishionID = permishionId as string;
  const { permission, isLoading, isError, mutate } = usePermissionById(permishionID);

  const handleBack = () => router.back();

  if (isLoading) {
    return <PermissionLoadingState title={transpermishion("permission")} />;
  }



  // Success state
  return (
    <>
      <ModuleHeader name={transpermishion("permission")} />
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          overflow: "auto",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)",
          p: 3
        }}
      >
        <PermissionDetails permission={permission} onBack={handleBack} />
      </Box>
    </>
  );
};

export default ViewPermission;

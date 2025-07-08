"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { deletePermission, usePermissionById } from "../../services/permissionAction";
import PermissionDetails from "../../components/permissionView";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";

const PermissionViewPage: React.FC = () => {
  const transpermission = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

  const router = useRouter();
  const params = useParams();
  const permissionId = params.permissionId as string;

  const { permission } = usePermissionById(permissionId);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const showSnackbar = (message: string, severity: string) => {
    setSnackbar({
      open: true,
      message,
      severity: severity as SNACKBAR_SEVERITY
    });
  };

  const handleBack = () => {
    router.back();
  };
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!permission) return;

    try {
      await deletePermission(permission.id);
      setIsDeleteDialogOpen(false);
      showSnackbar(transpermission("deletesuccess"), SNACKBAR_SEVERITY.SUCCESS);

      router.back();
    } catch {
      showSnackbar(transpermission("deletefailed"), SNACKBAR_SEVERITY.ERROR);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
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
          {permission && (
            <PermissionDetails
              permission={permission}
              onBack={handleBack}
              handleDeleteClick={handleDeleteClick}
            />
          )}
        </Box>
      </Box>
      <CommonDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onSubmit={handleDeleteConfirm}
        title={transpermission("deletetitle")}
        submitLabel={transpermission("delete")}
        cancelLabel={transpermission("cancel")}
        submitColor="#b71c1c"
      >
        <Typography sx={{ pt: 2 }}>{transpermission("deleteconfirm")}</Typography>
      </CommonDialog>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default PermissionViewPage;

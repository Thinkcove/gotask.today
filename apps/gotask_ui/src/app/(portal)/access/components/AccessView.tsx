"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  TextField,
  IconButton
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/permission";
import { useAccessRoleById, useAccessOptions, deleteAccessRole } from "../services/accessService";
import AccessPermissionsContainer from "../components/AccessPermissionsContainer";
import CustomSnackbar from "../../../component/snackBar/snackbar";
import CommonDialog from "../../../component/dialog/commonDialog";
import Heading from "../../../component/header/title";

const AccessView: React.FC = () => {
  const t = useTranslations("Access");
  const { canAccess } = useUserPermission();
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    role: accessRole,
    isLoading: isRoleLoading,
    error: roleError
  } = useAccessRoleById(id as string);
  const { accessOptions, isLoading: isOptionsLoading, error: optionsError } = useAccessOptions();

  const [currentTab, setCurrentTab] = useState<string>("");

  if (!isRoleLoading && !isOptionsLoading && !currentTab) {
    if (accessRole?.application?.length > 0) {
      setCurrentTab(accessRole.application[0].access);
    } else if (accessOptions?.length > 0) {
      setCurrentTab(accessOptions[0].access);
    }
  }

  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "success" });

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const confirmDelete = async () => {
    if (!accessRole || isDeleting) return;
    try {
      setIsDeleting(true);
      const res = await deleteAccessRole(accessRole.id);
      if (res.success) {
        showSnackbar(res.message || t("updatesuccess"), "success");
        router.push("/access");
      } else {
        showSnackbar(res.message || t("updateerror"), "error");
      }
    } catch {
      showSnackbar(t("updateerror"), "error");
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  const selectedPermissions =
    accessRole?.application?.reduce(
      (acc: Record<string, string[]>, app: { access: string | number; actions: string[] }) => {
        acc[app.access] = app.actions;
        return acc;
      },
      {}
    ) || {};

  const selectedFields =
    accessRole?.application?.reduce(
      (
        acc: Record<string, Record<string, string[]>>,
        app: { access: string | number; restrictedFields: Record<string, string[]> }
      ) => {
        acc[app.access] = app.restrictedFields || {};
        return acc;
      },
      {}
    ) || {};

  if (isRoleLoading || isOptionsLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (roleError || optionsError) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography variant="body1" color="error">
          {(roleError || optionsError)?.includes("non-JSON")
            ? t("serverError")
            : roleError || optionsError || t("errorLoadingOptions")}
        </Typography>
      </Box>
    );
  }

  if (!accessRole) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {t("noaccessavailable")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "87vh", // Make it consistent and predictable
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        overflow: "hidden" // Prevent children from overflowing this container
      }}
    >
      {/* Content Wrapper */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexDirection={isMobile ? "row" : "row"}
          flexWrap={isMobile ? "wrap" : "nowrap"}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{ flex: isMobile ? "1 1 50%" : "unset", textTransform: "capitalize" }}
          >
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.VIEW) && (
              <IconButton onClick={() => router.back()} color="primary">
                <ArrowBack />
              </IconButton>
            )}
            <Heading title={accessRole.name} />
          </Box>

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            gap={1}
            sx={{ flex: isMobile ? "1 1 50%" : "unset" }}
          >
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.UPDATE) && (
              <IconButton
                onClick={() => router.push(`/access/pages/edit/${accessRole.id}`)}
                color="primary"
              >
                <Edit />
              </IconButton>
            )}
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.DELETE) && (
              <IconButton
                onClick={() => setOpenDeleteDialog(true)}
                color="error"
                disabled={isDeleting}
              >
                <Delete />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Role Name Field */}
        <Box sx={{ width: "100%", maxWidth: 500, mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, color: "#333", fontWeight: 500 }}>
            {t("accessName")}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={accessRole.name}
            disabled
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "&:hover fieldset": { borderColor: "#741B92" },
                "&.Mui-focused fieldset": { borderColor: "#741B92" }
              }
            }}
          />
        </Box>

        {/* Permissions */}
        <Typography variant="h6" fontWeight={600} sx={{ color: "#333" }}>
          {t("viewdetail")}
        </Typography>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            mt: 1,
            pr: 1
          }}
        >
          {accessOptions.length === 0 || !currentTab ? (
            <Box display="flex" justifyContent="center" mt={1}>
              <Typography variant="body1" color="text.secondary">
                {t("noaccessavailable")}
              </Typography>
            </Box>
          ) : (
            <AccessPermissionsContainer
              accessOptions={accessOptions}
              currentModule={currentTab}
              selectedPermissions={selectedPermissions}
              selectedFields={selectedFields}
              onTabChange={setCurrentTab}
              onCheckboxChange={() => {}}
              onFieldChange={() => {}}
              readOnly
            />
          )}
        </Box>
      </Box>

      {/* Dialog */}
      <CommonDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSubmit={confirmDelete}
        title={t("deleteaccess")}
        submitLabel={t("delete")}
        submitColor="#b71c1c"
      >
        <Typography variant="body1" color="text.secondary">
          {t("deleteconfirm")}
        </Typography>
      </CommonDialog>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default AccessView;

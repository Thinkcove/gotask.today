"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";
import {
  useAccessOptions,
  useAccessRoleById,
  updateAccessRole,
} from "../services/accessService";
import { AccessRole } from "../interfaces/accessInterfaces";
import AccessPermissionsContainer from "../components/AccessPermissionsContainer";
import AccessHeading from "../components/AccessHeading";
import { useTranslations } from "next-intl";
import CustomSnackbar from "../../../component/snackBar/snackbar";

export default function AccessEditForm() {
  const t = useTranslations("Access");
  const { canAccess } = useUserPermission();
  const { id } = useParams();
  const router = useRouter();

  const [roleName, setRoleName] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, string[]>
  >({});
  const [selectedFields, setSelectedFields] = useState<
    Record<string, Record<string, string[]>>
  >({});
  const [currentTab, setCurrentTab] = useState("User Management");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "info" });

  const { role, isLoading: isRoleLoading, error: roleError } = useAccessRoleById(
    String(id)
  );
  const {
    accessOptions,
    isLoading: isOptionsLoading,
    error: optionsError,
  } = useAccessOptions();

  const validModules = [
    "User Management",
    "Task Management",
    "Project Management",
    "Access Management",
    "Organization Management",
    "Role Management",
    "User Report",
  ];

  // Initialize roleName, selectedPermissions, and selectedFields when role is loaded
  if (
    role &&
    roleName === "" &&
    Object.keys(selectedPermissions).length === 0
  ) {
    setRoleName(role.name);
    setSelectedPermissions(
      role.application.reduce(
        (
          acc: Record<string, string[]>,
          app: { access: string; actions: string[] }
        ) => {
          acc[app.access] = app.actions;
          return acc;
        },
        {}
      )
    );
    setSelectedFields(
      role.application.reduce(
        (
          acc: Record<string, Record<string, string[]>>,
          app: { access: string; restrictedFields: Record<string, string[]> }
        ) => {
          acc[app.access] = app.restrictedFields || {};
          return acc;
        },
        {}
      )
    );
  }

  // Set currentTab when accessOptions and role are loaded
  if (
    accessOptions.length > 0 &&
    role &&
    !validModules.includes(currentTab)
  ) {
    const firstValidModule =
      role.application?.find((app: { access: string }) =>
        validModules.includes(app.access)
      )?.access ||
      accessOptions.find((opt: { access: string }) =>
        validModules.includes(opt.access)
      )?.access ||
      validModules[0];
    setCurrentTab(firstValidModule);
  }

  const handlePermissionChange = (
    module: string,
    action: string,
    checked: boolean
  ) => {
    setSelectedPermissions((prev) => {
      const existing = prev[module] || [];
      const updated = checked
        ? [...new Set([...existing, action])]
        : existing.filter((a) => a !== action);
      return { ...prev, [module]: updated };
    });
  };

  const handleFieldChange = (
    module: string,
    action: string,
    field: string,
    checked: boolean
  ) => {
    setSelectedFields((prev) => {
      const moduleFields = prev[module] || {};
      const actionFields = moduleFields[action.toUpperCase()] || [];

      const updatedFields = checked
        ? [...new Set([...actionFields, field])]
        : actionFields.filter((f) => f !== field);

      return {
        ...prev,
        [module]: {
          ...moduleFields,
          [action.toUpperCase()]: updatedFields,
        },
      };
    });
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      showSnackbar(t("accessNameRequired"), "error");
      return;
    }

    if (Object.keys(selectedPermissions).length === 0) {
      showSnackbar(t("atLeastOnePermissionRequired"), "error");
      return;
    }

    const application = Object.entries(selectedPermissions)
      .map(([access, actions]) => ({
        access,
        actions,
        restrictedFields: selectedFields[access] || {},
      }))
      .filter((app) => app.actions.length > 0);

    const payload: Partial<AccessRole> = {
      name: roleName.trim(),
      application,
      createdAt: role?.createdAt || "",
    };

    try {
      setIsSubmitting(true);
      const res = await updateAccessRole(String(id), payload);
      if (res.success) {
        showSnackbar(t("updatesuccess"), "success");
        setTimeout(() => {
          router.push("/access");
        }, 500);
      } else {
        showSnackbar(res.message || t("updateerror"), "error");
      }
    } catch (err) {
      console.error("Failed to update access role:", err);
      showSnackbar(t("updateerror"), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRoleLoading || isOptionsLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          alignItems: "center",
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "87vh",
        width: "97%",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        m: 3,
      }}
    >
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.VIEW) && (
              <Tooltip title={t("cancel")}>
                <IconButton onClick={() => router.back()} color="primary">
                  <ArrowBack />
                </IconButton>
              </Tooltip>
            )}
            <AccessHeading title={t("editaccess")} />
          </Stack>
        </Box>

        <Box sx={{ maxWidth: 400, width: "100%", mb: 1 }}>
          <Typography
            variant="body2"
            sx={{ color: "#333", fontWeight: 500 }}
          >
            {t("accessName")} *
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            required
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "&:hover fieldset": { borderColor: "#741B92" },
                "&.Mui-focused fieldset": { borderColor: "#741B92" },
              },
            }}
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ color: "#333" }}
        >
          {t("accessManagement")}
        </Typography>

        <Box
          sx={{ flex: 1, maxHeight: "calc(100vh - 240px)", overflowY: "auto" }}
        >
          {accessOptions.length === 0 ? (
            <Box display="flex" justifyContent="center">
              <Typography variant="body1" color="text.secondary">
                {t("noaccessavailable")}
              </Typography>
            </Box>
          ) : (
            <AccessPermissionsContainer
              currentModule={currentTab}
              accessOptions={accessOptions}
              selectedPermissions={selectedPermissions}
              selectedFields={selectedFields}
              onTabChange={setCurrentTab}
              onCheckboxChange={handlePermissionChange}
              onFieldChange={handleFieldChange}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          flexWrap: "wrap",
          flexDirection: { xs: "column-reverse", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          mt: { xs: 2, sm: 0 },
          backgroundColor: "white",
          padding: "8px 16px",
          borderTop: "1px solid #ddd",
        }}
      >
        {canAccess(APPLICATIONS.ACCESS, ACTIONS.VIEW) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push("/access")}
            sx={{
              minWidth: 120,
              borderRadius: 1,
              textTransform: "none",
              "&:hover": { bgcolor: "#f5f5f5" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {t("cancel")}
          </Button>
        )}
        {canAccess(APPLICATIONS.ACCESS, ACTIONS.UPDATE) && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              minWidth: 120,
              borderRadius: 1,
              textTransform: "none",
              bgcolor: "#741B92",
              "&:hover": { bgcolor: "#5e1675" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : (
              t("editaccess")
            )}
          </Button>
        )}
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}
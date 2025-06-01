"use client";

import React, { useState } from "react";
import { TextField, Typography, Button, CircularProgress, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";
import AccessHeading from "./AccessHeading";
import AccessPermissionsContainer from "../components/AccessPermissionsContainer";
import { useAccessOptions, createAccessRole } from "../services/accessService"; // Import from service
import { AccessRole } from "../interfaces/accessInterfaces";
import { useTranslations } from "next-intl";
import CustomSnackbar from "../../../component/snackBar/snackbar";

const AccessCreateForm: React.FC = () => {
  const t = useTranslations();
  const { canAccess } = useUserPermission();
  const [accessName, setAccessName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});
  const [selectedFields, setSelectedFields] = useState<Record<string, Record<string, string[]>>>({});
  const [currentModule, setCurrentModule] = useState("User Management");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "info" });
  const router = useRouter();

  const validModules = [
    "User Management",
    "Task Management",
    "Project Management",
    "Access Management",
    "Organization Management",
    "Role Management",
    "User Report"
  ];

  // Fetch access options using service hook
  const { accessOptions, isLoading, error } = useAccessOptions();

  // Set currentModule when accessOptions are loaded
  if (accessOptions.length > 0 && !validModules.includes(currentModule)) {
    const firstValidModule =
      accessOptions.find((opt: { access: string }) => validModules.includes(opt.access))?.access ||
      validModules[0];
    setCurrentModule(firstValidModule);
  }

  const handleCheckboxChange = (module: string, action: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const existing = prev[module] || [];
      const updated = checked
        ? [...new Set([...existing, action])]
        : existing.filter((a) => a !== action);
      return { ...prev, [module]: updated };
    });
  };

  const handleFieldChange = (module: string, action: string, field: string, checked: boolean) => {
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

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async () => {
    if (!accessName.trim()) {
      setSnackbar({
        open: true,
        message: t("Access.accessNameRequired"),
        severity: "error",
      });
      return;
    }

    const application = Object.entries(selectedPermissions)
      .map(([access, actions]) => ({
        access,
        actions,
        restrictedFields: selectedFields[access] || {},
      }))
      .filter((app) => app.actions.length > 0);

    if (application.length === 0) {
      setSnackbar({
        open: true,
        message: t("Access.atLeastOnePermissionRequired"),
        severity: "error",
      });
      return;
    }

    const payload: AccessRole = {
      name: accessName.trim(),
      application,
      id: "",
      createdAt: "",
    };

    try {
      setIsSubmitting(true);
      const response = await createAccessRole(payload);
      if (response.success) {
        setSnackbar({
          open: true,
          message: t("Access.successmessage"),
          severity: "success",
        });
        setTimeout(() => {
          router.push("/access");
        }, 500);
      } else {
        setSnackbar({
          open: true,
          message: response.message || t("Access.errormessage"),
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Failed to create access role:", err);
      setSnackbar({
        open: true,
        message: t("Access.errormessage"),
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        overflow: "hidden",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <AccessHeading title={t("Access.createaccessnew")} />
        <Box sx={{ maxWidth: 400, width: "100%", mt: 1 }}>
          <Typography variant="body2" sx={{ color: "#333", fontWeight: 500 }}>
            {t("Access.accessName")}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            required
            value={accessName}
            onChange={(e) => setAccessName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                "&:hover fieldset": {
                  borderColor: "#741B92",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#741B92",
                },
              },
            }}
          />
        </Box>

        <Typography variant="h6" fontWeight={600} sx={{ color: "#333", mt: 2, mb: 1 }}>
          {t("Access.accessManagement")}
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center">
            <Typography variant="body1" color="error">
              {error.includes("non-JSON")
                ? t("Access.serverError")
                : error || t("Access.errorLoadingOptions")}
            </Typography>
          </Box>
        ) : accessOptions.length === 0 ? (
          <Box display="flex" justifyContent="center">
            <Typography variant="body1" color="text.secondary">
              {t("Access.noaccessavailable")}
            </Typography>
          </Box>
        ) : (
          <AccessPermissionsContainer
            accessOptions={accessOptions}
            currentModule={currentModule}
            selectedPermissions={selectedPermissions}
            selectedFields={selectedFields}
            onTabChange={setCurrentModule}
            onCheckboxChange={handleCheckboxChange}
            onFieldChange={handleFieldChange}
          />
        )}
      </Box>

      <Box
        sx={{
          borderColor: "divider",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          mt: 2,
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
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            {t("Access.cancel")}
          </Button>
        )}
        {canAccess(APPLICATIONS.ACCESS, ACTIONS.CREATE) && (
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
              "&:hover": {
                bgcolor: "#5e1675",
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={20} /> : t("Access.createaccessnew")}
          </Button>
        )}
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default AccessCreateForm;
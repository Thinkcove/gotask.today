"use client";

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
import React, { useState, useEffect } from "react";
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

  // State for form fields
  const [roleName, setRoleName] = useState<string>("");
  const [application, setApplication] = useState<AccessRole["application"]>([]);
  const [currentTab, setCurrentTab] = useState<string>("");

  // Submission/loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  // Fetch role data & access options
  const {
    role,
    isLoading: isRoleLoading,
    error: roleError,
  } = useAccessRoleById(String(id));
  const {
    accessOptions,
    isLoading: isOptionsLoading,
    error: optionsError,
  } = useAccessOptions();

  const validModules = ["User Management", "Task Management", "Project Management"];

  // Initialize roleName and application when role data arrives
  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setApplication(role.application || []);
    }
  }, [role]);

  // Initialize current tab when accessOptions or role.application changes
  useEffect(() => {
    if (accessOptions.length > 0 && !currentTab) {
      const firstValidModule =
        role?.application?.find((app) => validModules.includes(app.access))?.access ||
        accessOptions.find((opt) => validModules.includes(opt.access))?.access ||
        validModules[0];
      setCurrentTab(firstValidModule);
    }
  }, [accessOptions, role, currentTab]);

  // Handle checkbox changes for permissions
  const handlePermissionChange = (access: string, action: string, checked: boolean) => {
    setApplication((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((app) => app.access === access);

      if (index > -1) {
        let actions = updated[index].actions;
        actions = checked ? [...actions, action] : actions.filter((a) => a !== action);
        updated[index] = { ...updated[index], actions: [...new Set(actions)] };
      } else if (checked) {
        updated.push({ access, actions: [action] });
      }

      return updated;
    });
  };

  const handleTabChange = (module: string) => {
    setCurrentTab(module);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      showSnackbar(`${t("accessName")} ${t("errormessage")}`, "error");
      return;
    }

    if (!role) {
      showSnackbar(t("errormessage"), "error");
      return;
    }

    const payload = {
      name: roleName.trim(),
      application,
      createdAt: role.createdAt,
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

  // Map selected permissions for the UI
  const selectedPermissionsMap = application.reduce(
    (acc: Record<string, string[]>, app) => {
      acc[app.access] = app.actions;
      return acc;
    },
    {}
  );

  // Loading and error states
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
          {roleError || optionsError}
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
        {/* Back Icon and Heading */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
          <Typography variant="body2" sx={{ color: "#333", fontWeight: 500 }}>
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

        <Typography variant="h6" fontWeight={600} sx={{ color: "#333" }}>
          {t("accessManagement")}
        </Typography>

        <Box sx={{ flex: 1, maxHeight: "calc(100vh - 240px)", overflowY: "auto" }}>
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
              selectedPermissions={selectedPermissionsMap}
              onCheckboxChange={handlePermissionChange}
              onTabChange={handleTabChange}
            />
          )}
        </Box>
      </Box>

      {/* Fixed Buttons */}
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
            {isSubmitting ? <CircularProgress size={20} /> : t("editaccess")}
          </Button>
        )}
      </Box>

      {/* Snackbar */}
      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
}

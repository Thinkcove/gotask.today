"use client";

import React, { useState } from "react";
import {
  TextField,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { userPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";
import AccessHeading from "./AccessHeading";
import AccessPermissionsContainer from "../components/AccessPermissionsContainer";
import { useAccessOptions, createAccessRole } from "../services/accessService";
import { AccessOption, AccessRole } from "../interfaces/accessInterfaces";
import { useTranslations } from "next-intl";

const AccessCreateForm: React.FC = () => {
  const t = useTranslations();
  const { canAccess } = userPermission();
  const [accessName, setAccessName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});
  const [currentModule, setCurrentModule] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { accessOptions, isLoading, error } = useAccessOptions();

  const validModules = ["User Management", "Task Management", "Project Management"];

  if (accessOptions.length > 0 && !currentModule) {
    const firstValidModule = accessOptions.find(opt => validModules.includes(opt.access))?.access || validModules[0];
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

  const handleSubmit = async () => {
    if (!accessName.trim()) {
      alert(t("Access.accessNameRequired"));
      return;
    }

    const application = Object.entries(selectedPermissions).map(([access, actions]) => ({
      access,
      actions,
    })).filter(app => app.actions.length > 0);

    if (application.length === 0) {
      alert(t("Access.atLeastOnePermissionRequired")); // Add this key in your translation file
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
      console.log("createAccessRole response:", response);
      if (response.success) {
        router.push("/portal/access");
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.error("Failed to create access role:", err);
      alert(t("Access.errormessage"));
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

        <Typography variant="h6" fontWeight={600} sx={{ color: "#333" }}>
          {t("Access.accessManagement")}
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center">
            <Typography variant="body1" color="error">
              {error}
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
            onTabChange={setCurrentModule}
            onCheckboxChange={handleCheckboxChange}
          />
        )}
      </Box>

      <Box
        sx={{
          borderColor: "divider",
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
        }}
      >
        {canAccess(APPLICATIONS.ACCESS, ACTIONS.VIEW) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push("/portal/access")}
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
    </Box>
  );
};

export default AccessCreateForm;

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
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";
import {
  useAccessOptions,
  useAccessRoleById,
  updateAccessRole,
} from "../services/accessService";
import { AccessOption, AccessRole } from "../interfaces/accessInterfaces";
import AccessPermissionsContainer from "../components/AccessPermissionsContainer";
import AccessHeading from "../components/AccessHeading";
import { useTranslations } from "next-intl"; 

export default function AccessEditForm() {
  const t = useTranslations("Access"); 
  const { canAccess } = userPermission();
  const { id } = useParams();
  const router = useRouter();

  const [roleName, setRoleName] = useState<string>("");
  const [application, setApplication] = useState<AccessRole["application"]>([]);
  const [currentTab, setCurrentTab] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { role, isLoading: isRoleLoading, error: roleError } = useAccessRoleById(String(id));
  const { accessOptions, isLoading: isOptionsLoading, error: optionsError } = useAccessOptions();

  const validModules = ["User Management", "Task Management", "Project Management"];

  if (role && roleName === "" && application.length === 0) {
    setRoleName(role.name);
    setApplication(role.application || []);
  }

  if (accessOptions.length > 0 && !currentTab) {
    const firstValidModule =
      role?.application?.find((app: { access: string; }) => validModules.includes(app.access))?.access ||
      accessOptions.find(opt => validModules.includes(opt.access))?.access ||
      validModules[0];
    setCurrentTab(firstValidModule);
  }

  const handlePermissionChange = (access: string, action: string, checked: boolean) => {
    setApplication((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((app) => app.access === access);

      if (index > -1) {
        let actions = updated[index].actions;
        actions = checked
          ? [...actions, action]
          : actions.filter((a) => a !== action);
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

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toast.error(t("accessName") + " " + t("errormessage"));
      return;
    }

    if (!role) {
      toast.error(t("errormessage"));
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
        toast.success(t("updatesuccess"));
        router.push("/portal/access");
      } else {
        toast.error(res.message || t("updateerror"));
      }
    } catch (err) {
      console.error("Failed to update access role:", err);
      toast.error(t("updateerror"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPermissionsMap = application.reduce(
    (acc: Record<string, string[]>, app) => {
      acc[app.access] = app.actions;
      return acc;
    },
    {}
  );

  if (isRoleLoading || isOptionsLoading) {
    return (
      <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (roleError || optionsError) {
    return (
      <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
        height: "95%",
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

        <Box sx={{ maxWidth: 400, width: "100%", mb: 1, mt: 1 }}>
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

        <Box sx={{ flex: 1, maxHeight: "80%", overflow: "hidden" }}>
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

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          flexWrap: "wrap",
          flexDirection: { xs: "column-reverse", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          mt: { xs: 2, sm: 0 },
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
    </Box>
  );
}

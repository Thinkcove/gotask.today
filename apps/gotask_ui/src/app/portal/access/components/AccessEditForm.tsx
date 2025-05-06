"use client";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
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

export default function AccessEditForm() {
  const { canAccess } = userPermission();
  const { id } = useParams();
  const router = useRouter();

  const [roleName, setRoleName] = useState<string>("");
  const [application, setApplication] = useState<AccessRole["application"]>([]);
  const [currentTab, setCurrentTab] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { role, isLoading: isRoleLoading, error: roleError } = useAccessRoleById(String(id));
  const { accessOptions, isLoading: isOptionsLoading, error: optionsError } = useAccessOptions();

  console.log("AccessEditForm role:", role); // Debug log
  console.log("AccessEditForm isRoleLoading:", isRoleLoading); // Debug log
  console.log("AccessEditForm roleError:", roleError); // Debug log
  console.log("AccessEditForm accessOptions:", accessOptions); // Debug log
  console.log("AccessEditForm isOptionsLoading:", isOptionsLoading); // Debug log
  console.log("AccessEditForm optionsError:", optionsError); // Debug log

  // Initialize form data when role and options load
  if (role && roleName === "" && application.length === 0) {
    setRoleName(role.name);
    setApplication(role.application || []);
  }
  if (accessOptions.length > 0 && !currentTab) {
    setCurrentTab(
      role?.application?.[0]?.access || accessOptions[0].access || ""
    );
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
      toast.error("Role name is required");
      return;
    }

    if (!role) {
      toast.error("Role data not loaded");
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
      console.log("updateAccessRole response:", res); // Debug log
      if (res.success) {
        toast.success("Access role updated");
        router.push("/portal/access");
      } else {
        toast.error(res.message || "Failed to update role");
      }
    } catch (err) {
      console.error("Failed to update access role:", err);
      toast.error("Failed to update role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPermissionsMap = application.reduce(
    (acc: Record<string, string[]>, app: { access: string; actions: string[] }) => {
      acc[app.access] = app.actions;
      return acc;
    },
    {}
  );

  if (isRoleLoading || isOptionsLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
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
          height: "100vh",
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
        height: "90vh",
        width: "100%",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Edit Access Role
        </Typography>

        <TextField
          fullWidth
          label="Access Name"
          variant="outlined"
          required
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" mb={2}>
          Access Management
        </Typography>

        {accessOptions.length === 0 ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <Typography variant="body1" color="text.secondary">
              No Access Options Available.
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

      <Box
        sx={{
          borderTop: 1,
          borderColor: "gray",
          pt: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        {canAccess(APPLICATIONS.ACCESS, ACTIONS.VIEW) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push("/portal/access")}
          >
            Cancel
          </Button>
        )}
        {canAccess(APPLICATIONS.ACCESS, ACTIONS.UPDATE) && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={20} /> : "Save Changes"}
          </Button>
        )}
      </Box>
    </Box>
  );
}
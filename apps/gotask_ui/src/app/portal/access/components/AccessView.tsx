"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  useMediaQuery,
  useTheme,
  TextField,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";
import {
  useAccessRoleById,
  useAccessOptions,
  deleteAccessRole,
} from "../services/accessService";
import { AccessOption, AccessRole } from "../interfaces/accessInterfaces";
import AccessPermissionsContainer from "./AccessPermissionsContainer";
import Button from "./Button";
import AccessHeading from "./AccessHeading";

const AccessView: React.FC = () => {
  const { canAccess } = userPermission();
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentTab, setCurrentTab] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { role: accessRole, isLoading: isRoleLoading, error: roleError } = useAccessRoleById(
    id as string
  );
  const { accessOptions, isLoading: isOptionsLoading, error: optionsError } = useAccessOptions();

  console.log("AccessView accessRole:", accessRole); // Debug log
  console.log("AccessView isRoleLoading:", isRoleLoading); // Debug log
  console.log("AccessView roleError:", roleError); // Debug log
  console.log("AccessView accessOptions:", accessOptions); // Debug log
  console.log("AccessView isOptionsLoading:", isOptionsLoading); // Debug log
  console.log("AccessView optionsError:", optionsError); // Debug log

  // Set initial tab when data loads
  if (accessOptions.length > 0 && !currentTab && accessRole) {
    setCurrentTab(
      accessRole.application?.[0]?.access || accessOptions[0].access || ""
    );
  }

  const handleDelete = async () => {
    if (!accessRole || isDeleting) return;

    const confirmed = window.confirm("Are you sure you want to delete this access role?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const res = await deleteAccessRole(accessRole.id);
      console.log("deleteAccessRole response:", res); // Debug log
      if (res.success) {
        toast.success(res.message || "Role deleted successfully.");
        router.push("/portal/access");
      } else {
        toast.error(res.message || "Failed to delete role.");
      }
    } catch (err) {
      console.error("Failed to delete access role:", err);
      toast.error("Unexpected error while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedPermissions = accessRole?.application?.reduce(
    (acc: Record<string, string[]>, app: { access: string; actions: string[] }) => {
      acc[app.access] = app.actions;
      return acc;
    },
    {}
  ) || {};

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

  if (!accessRole) {
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
        <Typography variant="body1" color="text.secondary">
          No Access Role Found
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
        borderRadius: "2px",
        boxShadow: 3,
        p: 2,
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
        >
          <AccessHeading title={accessRole.name} />
          <Stack
            direction={isMobile ? "column" : "row"}
            spacing={1}
            width={isMobile ? "100%" : "auto"}
          >
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.VIEW) && (
              <Button text="Back" onClick={() => router.back()} fullWidth={isMobile} />
            )}
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.UPDATE) && (
              <Button
                text="Edit"
                href={`/portal/access/pages/edit/${accessRole.id}`}
                fullWidth={isMobile}
              />
            )}
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.DELETE) && (
              <Button text="Delete" onClick={handleDelete} fullWidth={isMobile} />
            )}
          </Stack>
        </Box>

        <TextField
          fullWidth
          label="Access Name"
          variant="outlined"
          value={accessRole.name}
          disabled
          sx={{ mb: 2 }}
        />

        <Typography variant="h6" mb={2}>
          Permissions
        </Typography>

        {accessOptions.length === 0 ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <Typography variant="body1" color="text.secondary">
              No Access Options Available.
            </Typography>
          </Box>
        ) : (
          <AccessPermissionsContainer
            accessOptions={accessOptions}
            currentModule={currentTab}
            selectedPermissions={selectedPermissions}
            onTabChange={setCurrentTab}
            onCheckboxChange={() => {}}
            readOnly
          />
        )}
      </Box>
    </Box>
  );
};

export default AccessView;
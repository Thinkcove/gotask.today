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
  Tooltip,
  IconButton,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";

import { userPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";
import {
  useAccessRoleById,
  useAccessOptions,
  deleteAccessRole,
} from "../services/accessService";
import { AccessOption, AccessRole } from "../interfaces/accessInterfaces";
import AccessPermissionsContainer from "./AccessPermissionsContainer";
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

  const validModules = ["User Management", "Task Management", "Project Management"];

  if (accessOptions.length > 0 && !currentTab && accessRole) {
    const firstValidModule =
      accessRole.application?.find((app: { access: string }) =>
        validModules.includes(app.access)
      )?.access ||
      accessOptions.find((opt) => validModules.includes(opt.access))?.access ||
      validModules[0];
    setCurrentTab(firstValidModule);
  }

  const handleDelete = async () => {
    if (!accessRole || isDeleting) return;

    const confirmed = window.confirm("Are you sure you want to delete this access role?");
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const res = await deleteAccessRole(accessRole.id);
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

  const selectedPermissions =
    accessRole?.application?.reduce(
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

  if (!accessRole) {
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
      height: "95%",
      width: "97%",
      bgcolor: "white",
      borderRadius: 2,
      boxShadow: 3,
      p: 2,
      m: 3, // uniform margin on all sides
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
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="flex-end"
          >
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.VIEW) && (
              <Tooltip title="Back">
                <IconButton onClick={() => router.back()} color="primary">
                  <ArrowBack />
                </IconButton>
              </Tooltip>
            )}
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.UPDATE) && (
              <Tooltip title="Edit">
                <IconButton
                  onClick={() =>
                    router.push(`/portal/access/pages/edit/${accessRole.id}`)
                  }
                  color="primary"
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.DELETE) && (
              <Tooltip title="Delete">
                <IconButton onClick={handleDelete} color="error" disabled={isDeleting}>
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>

        <Box sx={{ maxWidth: 400, width: "100%", mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, color: "#333", fontWeight: 500 }}>
            Access Name
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={accessRole.name}
            disabled
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

        <Typography variant="h6" mb={2} fontWeight={600} sx={{ color: "#333" }}>
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

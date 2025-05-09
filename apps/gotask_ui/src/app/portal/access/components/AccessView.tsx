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
import { useTranslations } from "next-intl";

import { userPermission } from "@/app/common/utils/userPermission";
import { APPLICATIONS, ACTIONS } from "@/app/common/utils/authCheck";
import {
  useAccessRoleById,
  useAccessOptions,
  deleteAccessRole,
} from "../services/accessService";
import AccessPermissionsContainer from "./AccessPermissionsContainer";
import AccessHeading from "./AccessHeading";

const AccessView: React.FC = () => {
  const t = useTranslations("Access");

  const { canAccess } = userPermission();
  const { id } = useParams();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [currentTab, setCurrentTab] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { role: accessRole, isLoading: isRoleLoading, error: roleError } = useAccessRoleById(id as string);
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

    const confirmed = window.confirm(t("deleteconfirm"));
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const res = await deleteAccessRole(accessRole.id);
      if (res.success) {
        toast.success(res.message || t("updatesuccess"));
        router.push("/portal/access");
      } else {
        toast.error(res.message || t("updateerror"));
      }
    } catch (err) {
      console.error("Failed to delete access role:", err);
      toast.error(t("updateerror"));
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

  if (!accessRole) {
    return (
      <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
        height: "95%",
        width: "97%",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: isMobile ? 1.5 : 2,
        m: isMobile ? 1 : 3,
      }}
    >
      <Box sx={{ flex: 1, overflowY: "auto" }}>


        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 2 : 0}
        >
          <AccessHeading title={accessRole.name} />
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={isMobile ? "center" : "flex-end"}
            width={isMobile ? "100%" : "auto"}
          >
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.VIEW) && (
              <Tooltip title={t("cancel")}>
                <IconButton onClick={() => router.back()} color="primary">
                  <ArrowBack />
                </IconButton>
              </Tooltip>
            )}
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.UPDATE) && (
              <Tooltip title={t("editaccess")}>
                <IconButton
                  onClick={() => router.push(`/portal/access/pages/edit/${accessRole.id}`)}
                  color="primary"
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            )}
            {canAccess(APPLICATIONS.ACCESS, ACTIONS.DELETE) && (
              <Tooltip title={t("deleteaccess")}>
                <IconButton onClick={handleDelete} color="error" disabled={isDeleting}>
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>

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
          {t("viewdetail")}
        </Typography>

        {accessOptions.length === 0 ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <Typography variant="body1" color="text.secondary">
              {t("noaccessavailable")}
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

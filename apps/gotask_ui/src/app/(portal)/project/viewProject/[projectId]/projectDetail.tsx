"use client";

import React, { useState } from "react";
import { Box, Typography, Grid, IconButton, Button, Divider, Stack } from "@mui/material";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { Project } from "../../interfaces/projectInterface";
import { useAllUsers } from "@/app/(portal)/task/service/taskAction";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import FormField, { SelectOption } from "@/app/component/input/formField";
import { useParams, useRouter } from "next/navigation";
import { assignUsersToProject, removeUsersFromProject } from "../../services/projectAction";
import { KeyedMutator } from "swr";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { getStatusColor } from "@/app/common/constants/task";
import EditProject from "./editProject";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import LabelValueText from "@/app/component/text/labelValueText";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import { useUserPermission } from "@/app/common/utils/userPermission";

interface ProjectDetailProps {
  project: Project;
  mutate: KeyedMutator<Project>;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, mutate }) => {
  const { canAccess } = useUserPermission();
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const [open, setOpen] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { getAllUsers } = useAllUsers();
  const assignedUserIds = project.users.map((user) => user.id);
  const unassignedUsers = getAllUsers.filter(
    (user: SelectOption) => !assignedUserIds.includes(user.id)
  );
  const { projectId } = useParams();
  const projectID = projectId as string;

  const handleBack = () => {
    setTimeout(() => router.push("/project"), 2000);
  };

  const handleAddUser = async () => {
    setOpen(false);
    try {
      const response = await assignUsersToProject(selectedUserIds, projectID);
      await mutate();
      setSelectedUserIds([]);
      setSnackbar({
        open: true,
        message: response.message,
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch {
      setSnackbar({
        open: true,
        message: transproject("erroradd"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const onClose = () => {
    setSelectedUserIds([]);
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      const response = await removeUsersFromProject([selectedUserId], projectID);
      await mutate();
      setOpenDeleteDialog(false);
      setSelectedUserId(null);
      setSnackbar({
        open: true,
        message: response.message,
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch {
      setSnackbar({
        open: true,
        message: transproject("errorremove"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  return (
    <>
      <ModuleHeader name={transproject("detailview")} />
      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            p: 4,
            bgcolor: "#f9fafb",
            border: "1px solid #e0e0e0"
          }}
        >
          {/* Back and Project Name */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" sx={{ mr: 2 }}>
              <ArrowBack onClick={handleBack} />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%"
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ textTransform: "capitalize", whiteSpace: "nowrap" }}
                >
                  {project.name}
                </Typography>
                <StatusIndicator status={project.status} getColor={getStatusColor} />
              </Box>
              <Box
                sx={{
                  display: "flex"
                }}
              >
                {canAccess(APPLICATIONS.PROJECT, ACTIONS.UPDATE) && (
                  <IconButton edge="start" color="primary" onClick={() => setEditOpen(true)}>
                    <Edit />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>

          {/* Project Description & Dates */}
          <Grid container spacing={2} flexDirection="column" mb={2}>
            <Grid item xs={12} md={6}>
              <LabelValueText
                label={transproject("detaildescription")}
                value={project.description}
              />
            </Grid>
          </Grid>
          <Box display="flex" alignItems="center" mb={1} gap={2}>
            <Typography
              variant="body1"
              sx={{
                color: "#741B92",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" }
              }}
              onClick={() => router.push(`/project/viewProject/${projectID}/goals`)}
            >
              {transproject("linkgoals")}
            </Typography>

            <Divider orientation="vertical" flexItem sx={{ height: 20, bgcolor: "#999" }} />

            <Typography
              variant="body1"
              sx={{
                color: "#741B92",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" }
              }}
              onClick={() => router.push(
                `/project/viewProject/${projectID}/stories?name=${encodeURIComponent(project.name)}`
              )}
            >
              {transproject("linkstories")}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Assignee Section Header & Add Button */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mr={4} mb={2}>
            <Typography variant="h5" fontWeight={600}>
              {transproject("detailassignee")}
            </Typography>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              {canAccess(APPLICATIONS.PROJECT, ACTIONS.ASSIGN) && (
                <Button
                  variant="contained"
                  onClick={() => setOpen(true)}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2
                  }}
                >
                  {transproject("detailaddassignee")}
                </Button>
              )}
            </Box>
          </Box>

          {/* Assignee List */}
          <Grid container spacing={3} sx={{ maxHeight: "500px", overflowY: "auto" }}>
            {project.users.length > 0 ? (
              project.users.map((user) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bgcolor: "#ffffff",
                      border: "1px solid #e0e0e0"
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ minWidth: 0, flex: 1 }}
                    >
                      <AlphabetAvatar userName={user.name} size={44} fontSize={16} />
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          fontWeight={600}
                          fontSize="1rem"
                          sx={{
                            textTransform: "capitalize",
                            wordBreak: "break-word",
                            maxWidth: 200
                          }}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ wordBreak: "break-word", maxWidth: 200 }}
                        >
                          {user.user_id}
                        </Typography>
                      </Box>
                    </Stack>
                    {canAccess(APPLICATIONS.PROJECT, ACTIONS.UNASSIGN) && (
                      <Box sx={{ flexShrink: 0 }}>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setOpenDeleteDialog(true);
                          }}
                          sx={{
                            transition: "0.2s ease",
                            "&:hover": {
                              transform: "scale(1.1)"
                            }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography color="text.secondary">{transproject("detailnouser")}</Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Dialogs */}
        <CommonDialog
          open={open}
          onClose={onClose}
          onSubmit={handleAddUser}
          title={transproject("addassignetitle")}
          submitLabel={transproject("addusertitle")}
        >
          <FormField
            label={transproject("labelassignee")}
            type="multiselect"
            placeholder={transproject("placeholdeselect")}
            options={unassignedUsers}
            value={selectedUserIds}
            onChange={(ids) => setSelectedUserIds(ids as string[])}
          />
        </CommonDialog>

        <EditProject
          open={editOpen}
          onClose={() => setEditOpen(false)}
          data={project}
          mutate={mutate}
          projectID={projectID}
        />

        <CommonDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onSubmit={handleDelete}
          title={transproject("titledelete")}
          submitLabel={transproject("labeldelete")}
        >
          <Typography>
            {transproject("removeuserconfirmation")}
            <br />
            {transproject("removeusernote1")}
            <br />
            {transproject("removeusernote2")}
          </Typography>
        </CommonDialog>

        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </Box>
    </>
  );
};

export default ProjectDetail;

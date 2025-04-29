import React, { useState } from "react";
import { Box, Typography, Grid, IconButton, Button, Divider, Stack, Chip } from "@mui/material";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { Project } from "../../interfaces/projectInterface";
import { fetchAllUsers } from "@/app/portal/task/service/taskAction";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import FormField from "@/app/component/formField";
import { useParams, useRouter } from "next/navigation";
import { assignUsersToProject, removeUsersFromProject } from "../../services/projectAction";
import { KeyedMutator } from "swr";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { getStatusColor } from "@/app/common/constants/task";
import EditProject from "./editProject";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import LabelValueText from "@/app/component/text/labelValueText";

interface ProjectDetailProps {
  project: Project;
  mutate: KeyedMutator<Project>;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, mutate }) => {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // state for the delete confirmation dialog
  const router = useRouter();
  const handleBack = () => {
    setTimeout(() => router.back(), 2000);
  };
  const [editOpen, setEditOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { getAllUsers } = fetchAllUsers(); // Fetch all users
  const { projectId } = useParams();
  const projectID = projectId as string;
  const handleAddUser = async () => {
    setOpen(false);
    try {
      const response = await assignUsersToProject(selectedUserIds, projectID);
      await mutate();
      setSnackbar({
        open: true,
        message: response.message,
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error while adding assignee",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedUserId) return; // If no user selected, do nothing
    try {
      const response = await removeUsersFromProject([selectedUserId], projectID); // send array with 1 id
      await mutate();
      setOpenDeleteDialog(false);
      setSelectedUserId(null); // clear after deletion
      setSnackbar({
        open: true,
        message: response.message,
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error while removing assignee",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  return (
    <>
      <ModuleHeader name="Project Detail View" />
      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        {/* Project and Users Info */}
        <Box
          sx={{
            borderRadius: 4,
            p: 4,
            bgcolor: "#f9fafb",
            border: "1px solid #e0e0e0"
          }}
        >
          {/* User Info Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Typography variant="h4" fontWeight={700}>
                {project.name}
              </Typography>

              <IconButton edge="start" color="primary" onClick={() => setEditOpen(true)}>
                <Edit />
              </IconButton>
            </Box>
          </Box>

          {/* Basic Details */}
          <Grid container spacing={2} flexDirection="column" mb={2}>
            <Grid item xs={12} md={6}>
              <LabelValueText label="Description" value={project.description} />
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <LabelValueText
                label=" Created on"
                value={new Date(project.createdAt).toLocaleDateString()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                Status
              </Typography>
              <Chip
                label={project.status}
                color="primary"
                sx={{
                  backgroundColor: getStatusColor(project.status),
                  textTransform: "capitalize"
                }}
                size="small"
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4 }} />

          {/* Assignees Section */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight={600}>
              Assignees
            </Typography>
            <Button
              variant="contained"
              onClick={() => setOpen(true)}
              sx={{
                textTransform: "none",
                borderRadius: 2
              }}
            >
              Add Assignee
            </Button>
          </Box>

          {/* Users Grid */}
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
                    <Stack direction="row" spacing={2} alignItems="center">
                      <AlphabetAvatar userName={user.name} size={44} fontSize={16} />

                      <Box>
                        <Typography fontWeight={600} fontSize="1rem">
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.user_id}
                        </Typography>
                      </Box>
                    </Stack>

                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedUserId(user.id); // <-- save which user is clicked
                        setOpenDeleteDialog(true); // <-- open the confirmation dialog
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
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography color="text.secondary">No users assigned yet.</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
        {/* Add User Dialog */}
        <CommonDialog
          open={open}
          onClose={onClose}
          onSubmit={handleAddUser}
          title="Add Assignee"
          submitLabel=" Add User"
        >
          <FormField
            label="Assignees"
            type="multiselect"
            placeholder="Select users"
            options={getAllUsers}
            value={selectedUserIds} // This is an array of user IDs: ["123", "456"]
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
          title="Delete User"
          submitLabel="Delete"
        >
          <Typography>
            Are you sure you want to remove this user from the project?
            <br />
            This action will unassign the user, but will not delete their account.
            <br />
            You can reassign them anytime later if needed.
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

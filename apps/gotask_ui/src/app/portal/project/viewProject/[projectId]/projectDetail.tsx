import React, { useState } from "react";
import { Box, Typography, Grid, IconButton, Button, Divider, Stack } from "@mui/material";
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

interface ProjectDetailProps {
  project: Project;
  mutate: KeyedMutator<Project>;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, mutate }) => {
  const [open, setOpen] = useState(false);
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

  const handleDeleteUser = async (userIds: string[]) => {
    try {
      const response = await removeUsersFromProject(userIds, projectID);
      await mutate();
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
      <Box
        sx={{
          backgroundColor: "#741B92", // Solid color for a bold look
          color: "white",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
            textTransform: "capitalize"
          }}
        >
          Project Detail View
        </Typography>
      </Box>
      <Box
        sx={{
          minHeight: "100vh",
          px: 3,
          py: 4,
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
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 3
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <IconButton edge="start" color="primary" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {project.name}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {project.description}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Created on: {new Date(project.createdAt).toLocaleDateString()}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    pt: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: getStatusColor(project.status),
                      mr: 1.5
                    }}
                  />
                  <Typography
                    sx={{
                      color: getStatusColor(project.status),
                      textTransform: "capitalize"
                    }}
                  >
                    Status : {project.status}
                  </Typography>
                </Box>
              </Box>
            </Box>
            {/* Status Pill */}
            <IconButton edge="start" color="primary" onClick={() => setEditOpen(true)}>
              <Edit />
            </IconButton>
          </Box>

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
                      onClick={() => handleDeleteUser([user.id])}
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

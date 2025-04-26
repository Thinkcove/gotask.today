import React, { useState } from "react";
import { Box, Typography, Card, IconButton, Divider, Stack, Chip, Grid } from "@mui/material";
import { ArrowBack, Delete, Edit } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { IUserField, User } from "../../interfaces/userInterface";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import EditUser from "./editUser";
import { KeyedMutator } from "swr";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { deleteUser } from "../../services/userAction";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";

interface UserDetailProps {
  user: User;
  mutate: KeyedMutator<User>;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, mutate }) => {
  const router = useRouter();
  const { userId } = useParams();
  const userID = userId as string;
  const [editOpen, setEditOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // state for the delete confirmation dialog
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const handleBack = () => {
    setTimeout(() => router.back(), 2000);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userID);
      await mutate();
      setSnackbar({
        open: true,
        message: "User deleted successfully!",
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      setOpenDeleteDialog(false);
      setTimeout(() => router.back(), 2000);
    } catch {
      setSnackbar({
        open: true,
        message: "Error while deleting a user",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const mapUserToUserField = (user: User): IUserField => ({
    name: user.name,
    status: user.status,
    organization: user.organization,
    roleId: user.roleId._id,
    user_id: user.user_id
  });

  return (
    <>
      {/* Header */}
      <ModuleHeader name="User Detail View" />

      {/* Main Content */}
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
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0"
          }}
        >
          {/* User Info Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight={700} sx={{ textTransform: "capitalize" }}>
              {user.name}
            </Typography>
            <Box sx={{ flexGrow: 1 }} /> {/* This pushes the next icons to the right */}
            <IconButton color="primary" onClick={() => setEditOpen(true)}>
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => setOpenDeleteDialog(true)}>
              <Delete />
            </IconButton>
          </Box>

          {/* Basic Details */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                User ID
              </Typography>
              <Typography variant="body1">{user.user_id}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Role ID
              </Typography>
              <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                {user?.roleId.name}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={user.status ? "Active" : "Inactive"}
                color={user.status ? "success" : "error"}
                size="small"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {new Date(user.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Organizations
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {user.orgDetails?.map((orgId) => (
                  <Chip key={orgId.id} label={orgId.name} variant="outlined" />
                ))}
              </Stack>
            </Grid>
          </Grid>

          {/* Divider */}
          <Divider sx={{ my: 4 }} />

          {/* Project Details */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Project Details
          </Typography>

          {user.projectDetails && user.projectDetails.length > 0 ? (
            user.projectDetails.map((project) => (
              <Card key={project.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle1" fontWeight="600">
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {project.description}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                  <Chip label={`Status: ${project.status}`} size="small" color="warning" />
                </Stack>
              </Card>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography color="text.secondary">No projects assigned yet.</Typography>
            </Grid>
          )}
        </Box>

        {/* Edit User Dialog */}
        <EditUser
          open={editOpen}
          onClose={() => setEditOpen(false)}
          data={mapUserToUserField(user)}
          mutate={mutate}
          userID={userID}
        />

        <CommonDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          onSubmit={handleDelete}
          title="Delete User"
          submitLabel="Delete"
        >
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
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

export default UserDetail;

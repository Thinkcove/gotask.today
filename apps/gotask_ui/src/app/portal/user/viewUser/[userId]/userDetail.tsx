import React from "react";
import { Box, Typography, Card, IconButton, Divider, Stack, Chip, Grid } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { User } from "../../interfaces/userInterface";

interface UserDetailProps {
  user: User;
}

const UserDetail: React.FC<UserDetailProps> = ({ user }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#741B92",
          color: "white",
          py: 2,
          textAlign: "center",
          boxShadow: 2
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          User Detail View
        </Typography>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          minHeight: "100vh",
          px: 4,
          py: 6,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            p: 4,
            backgroundColor: "#fff"
          }}
        >
          {/* User Info Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight={700}>
              {user.name}
            </Typography>
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
              <Typography variant="body1">{user?.roleId.name}</Typography>
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
                {user.organization?.map((orgId) => (
                  <Chip key={orgId} label={orgId} variant="outlined" />
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

          {user.projectDetails?.map((project) => (
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
          ))}
        </Card>
      </Box>
    </>
  );
};

export default UserDetail;

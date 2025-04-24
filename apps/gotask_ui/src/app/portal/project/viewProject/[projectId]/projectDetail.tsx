import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  IconButton,
  Slide,
  Divider,
  Stack
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";

interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  users: { _id: string; name: string; user_id: string }[];
}

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [open, setOpen] = useState(false);
  const [newUserId, setNewUserId] = useState("");

  const handleAddUser = () => {
    if (newUserId.trim()) {
      console.log("Assign user:", newUserId);
      setNewUserId("");
      setOpen(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    console.log("Delete user with ID:", userId);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 4,
        py: 6,
        background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
      }}
    >
      {/* Project and Users Info */}
      <Card
        elevation={3}
        sx={{
          borderRadius: 4,
          p: 4,
          backgroundColor: "#fff",
          border: "1px solid #e0e0e0"
        }}
      >
        {/* Project Info */}
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {project.name}
        </Typography>
        <Typography variant="body1" mb={2}>
          {project.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created on: {new Date(project.createdAt).toLocaleDateString()}
        </Typography>
        <Divider sx={{ my: 3 }} /> {/* Divider between Project Info and Users */}
        {/* Users Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={600}>
            Team Members
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            + Add User
          </Button>
        </Box>
        <Grid container spacing={3}>
          {project.users.length > 0 ? (
            project.users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Card
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    "&:hover": {
                      boxShadow: 3
                    }
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    {/* Use AlphabetAvatar component for user avatar */}
                    <AlphabetAvatar userName={user.name} size={40} fontSize={16} />

                    <Box>
                      <Typography fontWeight={600} fontSize="1rem">
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {user.user_id}
                      </Typography>
                    </Box>
                  </Stack>
                  <IconButton color="error" onClick={() => handleDeleteUser(user._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography color="text.secondary" ml={2}>
              No users assigned yet.
            </Typography>
          )}
        </Grid>
      </Card>

      {/* Add User Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Slide as any}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="User ID"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            margin="normal"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddUser}>
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetail;

import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Paper,
  Slide
} from "@mui/material";
import { motion } from "framer-motion"; // For smooth animations

// Types for Project Data
interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user_id: string[];
}

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [open, setOpen] = useState(false);
  const [newUserId, setNewUserId] = useState("");

  const handleAddUser = () => {
    if (newUserId.trim()) {
      // Simulate API call or state update
      console.log("Add user:", newUserId);
      setNewUserId(""); // Reset input field
      setOpen(false); // Close modal
    }
  };

  return (
    <Box px={6} py={4} maxWidth="1200px" mx="auto">
      {/* Motion for smooth page entrance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Project Header */}
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight={600} sx={{ color: "#333" }}>
            {project.name}
          </Typography>
          <Chip label={project.status} color="primary" size="medium" />
        </Box>

        {/* Project Info Card */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Project Details
          </Typography>
          <Typography color="text.secondary" mb={2}>
            {project.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1}>
            <Typography>
              <strong>Project ID:</strong> {project.id}
            </Typography>
            <Typography>
              <strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}
            </Typography>
            <Typography>
              <strong>Last Updated:</strong> {new Date(project.updatedAt).toLocaleString()}
            </Typography>
          </Stack>
        </Paper>

        {/* Assigned Users Section */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Assigned Users</Typography>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
              + Assign User
            </Button>
          </Box>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            {project.user_id.length > 0 ? (
              project.user_id.map((uid, idx) => (
                <Chip
                  key={uid + idx}
                  avatar={<Avatar>{uid.charAt(0).toUpperCase()}</Avatar>}
                  label={uid}
                  variant="outlined"
                  sx={{
                    mb: 1,
                    "&:hover": { backgroundColor: "#f0f0f0", cursor: "pointer" } // Hover effect
                  }}
                />
              ))
            ) : (
              <Typography color="text.secondary">No users assigned yet.</Typography>
            )}
          </Stack>
        </Paper>
      </motion.div>

      {/* Modal Dialog for Adding User */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Slide as any}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Assign New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter User ID"
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
          <Button variant="contained" color="primary" onClick={handleAddUser}>
            Assign User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectDetail;

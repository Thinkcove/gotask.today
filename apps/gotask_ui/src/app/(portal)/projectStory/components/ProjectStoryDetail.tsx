"use client";

import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Button
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";

import {
  getProjectStoryById,
  deleteProjectStory
} from "@/app/(portal)/projectStory/services/projectStoryService";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import CommonDialog from "@/app/component/dialog/commonDialog";

const ProjectStoryDetail = () => {
  const { storyId, projectId } = useParams();
  const router = useRouter();

  const {
    data: story,
    isLoading
  } = useSWR(storyId ? ["projectStory", storyId] : null, () =>
    getProjectStoryById(storyId as string).then((res) => res?.data)
  );

  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteProjectStory(storyId as string);
      const message = response?.message || "Story deleted successfully";

      setSnackbar({ open: true, message, severity: "success" });

      setTimeout(() => router.push(`/project/viewProject/${projectId}/stories`), 500);
    } catch (error) {
      console.error("Failed to delete story:", error);
      setSnackbar({ open: true, message: "Failed to delete story", severity: "error" });
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!story) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Story not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "87vh",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        overflow: "hidden"
      }}
    >
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Back to Stories">
            <IconButton onClick={() => router.push(`/project/viewProject/${projectId}/stories`)} color="primary">
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" fontWeight={600} color="#741B92">
            {story.title}
          </Typography>
        </Box>

        <Box display="flex" gap={1}>
          <Tooltip title="Edit Story">
            <IconButton
              onClick={() => router.push(`/project/viewProject/${projectId}/stories/edit/${storyId}`)}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Story">
            <IconButton
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={isDeleting}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Description Section */}
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        <Typography variant="body1" mb={2}>
          {story.description || "No description provided."}
        </Typography>

        <Typography variant="caption" color="primary" display="block" mb={2}>
          Status: {story.status || "N/A"}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Task Section */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Tasks for this Story
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#741B92", textTransform: "none", borderRadius: 2 }}
              onClick={() => router.push(`/task/create?storyId=${storyId}`)}
            >
              + Create Task
            </Button>
          </Box>

          {/* Placeholder */}
          <Typography variant="body2" color="text.secondary">
            No tasks linked to this story yet.
          </Typography>
        </Box>
      </Box>

      {/* Delete Dialog */}
      <CommonDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSubmit={handleDelete}
        title="Delete Story"
        submitLabel="Delete"
      >
        <Typography variant="body1" color="text.secondary">
          Are you sure you want to delete this story?
        </Typography>
      </CommonDialog>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity as any}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default ProjectStoryDetail;

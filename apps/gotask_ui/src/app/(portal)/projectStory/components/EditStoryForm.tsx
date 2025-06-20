"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import {
  getProjectStoryById,
  updateProjectStory
} from "../services/projectStoryService";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import Heading from "@/app/component/header/title";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useSWR from "swr";
import FormField from "@/app/component/input/formField";

const EditStoryForm = () => {
  const { storyId, projectId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const handleCloseSnackbar = () => setSnackOpen(false);

  // Fetch story details
  const fetchStory = async () => {
    const response = await getProjectStoryById(storyId as string);
    return response?.data;
  };

  const { data: story, isLoading, error } = useSWR(
    storyId ? [`projectStory`, storyId] : null,
    fetchStory,
    {
      onSuccess: (data) => {
        setTitle(data?.title || "");
        setDescription(data?.description || "");
      }
    }
  );

  useEffect(() => {
    if (error) {
      setSnackMessage("Failed to load story.");
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setShowTitleError(true);
      setSnackMessage("Title is required.");
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = { title, description };
      await updateProjectStory(storyId as string, payload);

      setSnackMessage("Story updated successfully!");
      setSnackSeverity("success");
      setSnackOpen(true);

      setTimeout(() => {
        router.push(`/project/viewProject/${projectId}/stories/${storyId}`);
      }, 800);
    } catch (error) {
      console.error("Failed to update story:", error);
      setSnackMessage("Failed to update story.");
      setSnackSeverity("error");
      setSnackOpen(true);
    } finally {
      setIsSubmitting(false);
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
        <Typography color="error">Story not found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "87vh",
        width: "100%",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        overflow: "hidden"
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          {/* Header with Back Button */}
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Back to Story Details">
              <IconButton
                onClick={() =>
                  router.push(`/project/viewProject/${projectId}/stories/${storyId}`)
                }
                color="primary"
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Heading title="Edit Story" />
          </Box>

          {/* Title Field */}
          <FormField
            label="Title"
            type="text"
            placeholder="Update story title"
            required
            value={title}
            onChange={(val) => {
              setTitle(val as string);
              setShowTitleError(false);
            }}
            error={showTitleError ? "Title is required" : ""}
          />

          {/* Description Field */}
          <FormField
            label="Description"
            type="text"
            placeholder="Update story description"
            multiline
            height={150}
            value={description}
            onChange={(val) => setDescription(val as string)}
          />
        </Box>

        {/* Footer Buttons */}
        <Box
          sx={{
            borderTop: "1px solid #eee",
            pt: 2,
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() =>
              router.push(`/project/viewProject/${projectId}/stories/${storyId}`)
            }
            sx={{
              minWidth: 120,
              borderRadius: 1,
              textTransform: "none",
              "&:hover": { bgcolor: "#f5f5f5" }
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              minWidth: 120,
              borderRadius: 1,
              textTransform: "none",
              bgcolor: "#741B92",
              "&:hover": { bgcolor: "#5e1675" }
            }}
          >
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Update Story"}
          </Button>
        </Box>
      </Box>

      <CustomSnackbar
        open={snackOpen}
        message={snackMessage}
        severity={snackSeverity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default EditStoryForm;

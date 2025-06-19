"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import {
  getProjectStoryById,
  updateProjectStory
} from "../services/projectStoryService";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import Heading from "@/app/component/header/title";

const EditStoryForm = () => {
  const { storyId, projectId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const handleCloseSnackbar = () => setSnackOpen(false);

  useEffect(() => {
    if (!storyId) return;

    const fetchStory = async () => {
      try {
        const response = await getProjectStoryById(storyId as string);
        const story = response?.data;
        if (story) {
          setTitle(story.title || "");
          setDescription(story.description || "");
        } else {
          throw new Error("Story not found");
        }
      } catch (error) {
        console.error("Failed to load story:", error);
        setSnackMessage("Failed to load story.");
        setSnackSeverity("error");
        setSnackOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

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

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
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
      {/* Scrollable content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pr: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2
        }}
      >
        <Heading title="Edit Story" />

        {/* Title */}
        <TextField
          label="Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setShowTitleError(false);
          }}
          fullWidth
          required
          autoFocus
          placeholder="Update story title"
          error={showTitleError}
          helperText={showTitleError ? "Title is required" : " "}
          InputLabelProps={{ shrink: true }}
          sx={{
            maxWidth: 400,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
              backgroundColor: "#fff",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#741B92" },
              "&.Mui-focused fieldset": { borderColor: "#741B92" },
              "& input": { py: "16px" }
            }
          }}
        />

        {/* Description */}
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={6}
          margin="normal"
          placeholder="Update story description"
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
          gap: 1,
          backgroundColor: "white"
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

      {/* Snackbar */}
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

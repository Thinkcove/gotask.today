"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  CircularProgress
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { createProjectStory } from "@/app/(portal)/projectStory/services/projectStoryService";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import Heading from "@/app/component/header/title";

const CreateStoryForm = () => {
  const { projectId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const handleCloseSnackbar = () => setSnackOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setSnackMessage("Title is required to create a story.");
      setSnackSeverity("error");
      setSnackOpen(true);
      setShowTitleError(true);
      return;
    }

    setIsSubmitting(true);

    const createdBy = typeof window !== "undefined" ? localStorage.getItem("userId") : "";

    const payload = {
      title,
      description,
      projectId: projectId as string,
      createdBy: createdBy || "anonymous"
    };

    try {
      await createProjectStory(payload);

      setSnackMessage("Story created successfully!");
      setSnackSeverity("success");
      setSnackOpen(true);

      setTimeout(() => {
        router.push(`/project/viewProject/${projectId}/stories`);
      }, 800);
    } catch (error) {
      console.error("Failed to create story:", error);
      setSnackMessage("Failed to create story.");
      setSnackSeverity("error");
      setSnackOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {/* Scrollable Content */}
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
          <Heading title="Create New Story" />

          {/* Title Field */}
          <Box sx={{ maxWidth: 400, width: "100%" }}>
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
              placeholder="Enter story title"
              error={showTitleError}
              helperText={showTitleError ? "Title is required" : " "}
              InputLabelProps={{ shrink: true }}
              sx={{
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
          </Box>

          {/* Description Field */}
          <Box sx={{ width: "100%" }}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={12}
              margin="normal"
              placeholder="Enter story description (optional)"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                  backgroundColor: "#fff",
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#741B92" },
                  "&.Mui-focused fieldset": { borderColor: "#741B92" }
                }
              }}
            />
          </Box>
        </Box>

        {/* Footer Buttons - pinned to bottom inside form */}
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
            onClick={() => router.push(`/project/viewProject/${projectId}/stories`)}
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
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Create Story"}
          </Button>
        </Box>
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

export default CreateStoryForm;

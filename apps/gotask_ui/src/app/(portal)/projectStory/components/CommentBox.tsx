"use client";

import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { addCommentToProjectStory } from "../services/projectStoryService";
import CustomSnackbar from "@/app/component/snackBar/snackbar";

interface CommentBoxProps {
  storyId: string;
  onCommentAdded: () => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ storyId, onCommentAdded }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
    setUserId(storedUserId);

    if (!storedUserId) {
      console.warn("⚠️ No userId found in localStorage. Make sure it's set during login.");
    }
  }, []);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setSnack({ open: true, message: "Comment cannot be empty", severity: "error" });
      return;
    }

    if (!userId) {
      setSnack({ open: true, message: "Unable to identify user", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      await addCommentToProjectStory(storyId, {
        user_id: userId,
        comment
      });
      setSnack({ open: true, message: "Comment added!", severity: "success" });
      setComment("");
      onCommentAdded(); // Refresh story detail
    } catch (err) {
      setSnack({ open: true, message: "Failed to add comment", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={3}>
      <Typography fontWeight={600} mb={1}>
        Add Comment
      </Typography>
      <TextField
        label="Your Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        multiline
        rows={3}
        placeholder="Type your comment here"
      />
      <Box mt={1} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ backgroundColor: "#741B92", textTransform: "none", borderRadius: 2 }}
        >
          Submit
        </Button>
      </Box>

      <CustomSnackbar
        open={snack.open}
        message={snack.message}
        severity={snack.severity as any}
        onClose={() => setSnack({ ...snack, open: false })}
      />
    </Box>
  );
};

export default CommentBox;

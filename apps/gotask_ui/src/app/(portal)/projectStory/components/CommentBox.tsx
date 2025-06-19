"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Box, TextField, Button, Typography } from "@mui/material";
import { addCommentToProjectStory } from "../services/projectStoryService";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { useTranslations } from "next-intl";

// Utility to get userId from localStorage
const getUserId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("userId");
  }
  return null;
};

const fetchUserId = async () => getUserId();

interface CommentBoxProps {
  storyId: string;
  onCommentAdded: () => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ storyId, onCommentAdded }) => {
  const { data: userId } = useSWR("userId", fetchUserId, {
    revalidateOnFocus: false
  });

  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const t = useTranslations("Projects.Stories");

  const handleSubmit = async () => {
    if (!comment.trim()) {
      setSnack({ open: true, message: t("commentempty"), severity: "error" });
      return;
    }

    if (!userId) {
      setSnack({ open: true, message: t("usernotidentified"), severity: "error" });
      return;
    }

    setLoading(true);
    try {
      await addCommentToProjectStory(storyId, {
        user_id: userId,
        comment
      });

      setSnack({ open: true, message: t("commentaddsuccess"), severity: "success" });
      setComment("");
      onCommentAdded();
    } catch (err) {
      setSnack({ open: true, message: t("commentaddfail"), severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box mt={3}>
      <Typography fontWeight={600} mb={1}>
        {t("addcomment")}
      </Typography>
      <TextField
        label={t("commentlabel")}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        multiline
        rows={3}
        placeholder={t("commentplaceholder")}
      />
      <Box mt={1} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ backgroundColor: "#741B92", textTransform: "none", borderRadius: 2 }}
        >
          {t("submit")}
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

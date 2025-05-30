import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import FormField from "@/app/component/formField";
import { ITaskComment } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import CommentHistory from "./commentsHistory";
import { useUser } from "@/app/userContext";

interface TaskCommentsProps {
  comments: ITaskComment[];
  onSave: (comment: string, commentId?: string) => void; // Updated to handle comment ID for editing
  selectedComment?: ITaskComment | null; // Prop for the comment being edited
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onSave, selectedComment }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { user } = useUser(); // Get logged-in user details

  // Initialize newComment with selectedComment's content if available, else empty string
  const [newComment, setNewComment] = useState(selectedComment ? selectedComment.comment : "");
  const [isFocused, setIsFocused] = useState(!!selectedComment); // Show buttons if editing
  const [editingComment, setEditingComment] = useState<ITaskComment | null>(
    selectedComment || null
  );

  // Update state when selectedComment changes
  useEffect(() => {
    if (selectedComment) {
      setNewComment(selectedComment.comment);
      setEditingComment(selectedComment);
      setIsFocused(true);
    }
  }, [selectedComment]);

  const handleSave = () => {
    if (newComment.trim()) {
      // Pass the comment and the comment ID (if editing)
      onSave(newComment, editingComment?.id);
      setNewComment(""); // Clear the field after saving
      setIsFocused(false); // Hide buttons
      setEditingComment(null); // Clear editing state
    }
  };

  const handleCancel = () => {
    setNewComment(""); // Clear the field
    setIsFocused(false); // Hide buttons
    setEditingComment(null); // Clear editing state
  };

  const handleEdit = (comment: ITaskComment) => {
    setEditingComment(comment);
    setNewComment(comment.comment);
    setIsFocused(true);
  };

  return (
    <Box sx={{ mb: 5 }}>
      {/* Comment Input Field */}
      <FormField
        label={transtask("labelcomment")}
        type="text"
        placeholder={transtask("placeholdercomment")}
        value={newComment}
        onChange={(value) => setNewComment(value as string)}
        multiline
        height={80}
        onFocus={() => setIsFocused(true)}
      />

      {/* Save and Cancel Buttons */}
      {isFocused && (
        <Box display="flex" gap={1} mt={1}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#741B92", textTransform: "none" }}
            onClick={handleSave}
          >
            {transtask(editingComment ? "updatecomment" : "savecomment")}{" "}
            {/* Dynamic button label */}
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "black",
              border: "2px solid #741B92",
              px: 2,
              textTransform: "none",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }
            }}
            onClick={handleCancel}
          >
            {transtask("cancelcomment")}
          </Button>
        </Box>
      )}

      {/* Previous Comments */}
      {comments.length > 0 && (
        <CommentHistory comments={comments} onEdit={handleEdit} canEditId={user?.id || ""} />
      )}
    </Box>
  );
};

export default TaskComments;

import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { ITaskComment } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import CommentHistory from "./commentsHistory";
import { useUser } from "@/app/userContext";

interface TaskCommentsProps {
  comments: ITaskComment[];
  onSave: (comment: string, commentId?: string) => void;
  selectedComment?: ITaskComment | null;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onSave, selectedComment }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { user } = useUser();

  // Initialize only once, using selectedComment if provided
  const initialComment = selectedComment?.comment || "";
  const [newComment, setNewComment] = useState(initialComment);
  const [isFocused, setIsFocused] = useState(!!selectedComment);
  const [editingComment, setEditingComment] = useState<ITaskComment | null>(selectedComment || null);
  const SelectedComment = (comment: ITaskComment) => {
    setNewComment(comment.comment);
    setEditingComment(comment);
    setIsFocused(true);
  };

  const handleSave = () => {
    if (newComment.trim()) {
      onSave(newComment, editingComment?.id);
      setNewComment("");
      setIsFocused(false);
      setEditingComment(null);
    }
  };

  const handleCancel = () => {
    setNewComment("");
    setIsFocused(false);
    setEditingComment(null);
  };

  const handleEdit = (comment: ITaskComment) => {
    SelectedComment(comment);
  };

  return (
    <Box sx={{ mb: 5 }}>
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

      {isFocused && (
        <Box display="flex" gap={1} mt={1}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#741B92", textTransform: "none" }}
            onClick={handleSave}
          >
            {transtask(editingComment ? "updatecomment" : "savecomment")}
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

      {comments.length > 0 && (
        <CommentHistory comments={comments} onEdit={handleEdit} canEditId={user?.id || ""} />
      )}
    </Box>
  );
};

export default TaskComments;

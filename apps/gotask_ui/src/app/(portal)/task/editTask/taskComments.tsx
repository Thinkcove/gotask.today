import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import FormField from "@/app/component/formField";
import { ITaskComment } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import CommentHistory from "./commentsHistory";

interface TaskCommentsProps {
  comments: ITaskComment[];
  onSave: (comment: string) => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onSave }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSave = () => {
    if (newComment.trim()) {
      onSave(newComment);
      setNewComment("");
      setIsFocused(false);
    }
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
            {transtask("savecomment")}
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
            onClick={() => {
              setNewComment("");
              setIsFocused(false);
            }}
          >
            {transtask("cancelcomment")}
          </Button>
        </Box>
      )}

      {/* Previous Comments */}

      {comments.length > 0 && <CommentHistory comments={comments} />}
    </Box>
  );
};

export default TaskComments;

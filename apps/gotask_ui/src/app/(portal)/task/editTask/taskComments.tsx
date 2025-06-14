import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { ITask, ITaskComment } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import CommentHistory from "./commentsHistory";
import { KeyedMutator } from "swr";
import { SpeakerNotesOutlined } from "@mui/icons-material";

interface TaskCommentsProps {
  comments: ITaskComment[];
  onSave: (comment: string) => void;
  mutate: KeyedMutator<ITask>;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onSave, mutate }) => {
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
    <Box>
      <Box sx={{ display: "flex", gap: 1, color: "#741B92", alignItems: "center" }}>
        <Typography fontWeight="bold">{transtask("comment")}</Typography>
        <SpeakerNotesOutlined />
      </Box>
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

      {comments.length > 0 && <CommentHistory comments={comments} mutate={mutate} />}
    </Box>
  );
};

export default TaskComments;

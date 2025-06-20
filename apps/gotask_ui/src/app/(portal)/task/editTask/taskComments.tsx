import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ITask, ITaskComment } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import CommentHistory from "./commentsHistory";
import { KeyedMutator } from "swr";
import { SpeakerNotesOutlined } from "@mui/icons-material";
import RichEditor from "@/app/component/richText/richText";

interface TaskCommentsProps {
  comments: ITaskComment[];
  onSave: (comment: string) => void;
  mutate: KeyedMutator<ITask>;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onSave, mutate }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [newComment, setNewComment] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const handleSave = () => {
    const trimmed = newComment.trim();
    if (trimmed) {
      onSave(trimmed);
      setNewComment("");
      setEditorKey((prev) => prev + 1);
      setIsFocused(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, color: "#741B92", alignItems: "center" }}>
        <Typography fontWeight="bold">{transtask("comment")}</Typography>
        <SpeakerNotesOutlined />
      </Box>
      <Box mt={1} onClick={() => setIsFocused(true)}>
        <RichEditor
          key={editorKey}
          content={newComment}
          onUpdate={(html: string) => setNewComment(html)}
        />
      </Box>

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

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { ITask, ITaskComment } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import CommentHistory from "./commentsHistory";
import { KeyedMutator } from "swr";
import { SpeakerNotesOutlined } from "@mui/icons-material";
import ReusableEditor from "@/app/component/richText/textEditor";

interface TaskCommentsProps {
  comments: ITaskComment[];
  onSave: (comment: string) => void;
  mutate: KeyedMutator<ITask>;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onSave, mutate }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [editorKey, setEditorKey] = useState(0);

  const handleSave = (html: string) => {
    const trimmed = html.trim();
    if (trimmed) {
      onSave(trimmed);
      setEditorKey((prev) => prev + 1);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, color: "#741B92", alignItems: "center" }}>
        <Typography fontWeight="bold">{transtask("comment")}</Typography>
        <SpeakerNotesOutlined />
      </Box>
      <Box mt={1}>
        <ReusableEditor
          key={editorKey}
          onSave={handleSave}
          placeholder="Write your content here..."
        />
      </Box>

      {comments.length > 0 && <CommentHistory comments={comments} mutate={mutate} />}
    </Box>
  );
};

export default TaskComments;

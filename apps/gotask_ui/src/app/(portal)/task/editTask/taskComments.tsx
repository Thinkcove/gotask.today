"use client";

import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { ITask, ITaskComment } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import CommentHistory from "./commentsHistory";
import { KeyedMutator } from "swr";
import { SpeakerNotesOutlined } from "@mui/icons-material";
import ReusableEditor from "@/app/component/richText/textEditor";
import useSWR from "swr";
import { fetchUsers } from "../../user/services/userAction";
import { User } from "../../user/interfaces/userInterface";

interface TaskCommentsProps {
  comments: ITaskComment[];
  onSave: (comment: string) => void;
  mutate: KeyedMutator<ITask>;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onSave, mutate }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [editorKey, setEditorKey] = useState(0);

  const { data: fetchedUsers = [], isLoading } = useSWR("userList", fetchUsers);

  const userList = useMemo(() => {
    const mapped = (fetchedUsers || []).map((user: User) => ({
      id: user.id,
      mentionLabel: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.name
    }));

    if (!isLoading && mapped.length > 0) {
    }

    return mapped;
  }, [fetchedUsers, isLoading]);

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
        {isLoading ? (
          <Typography variant="body2" color="text.secondary">
            {transtask("loadinguser")}
          </Typography>
        ) : (
          <ReusableEditor
            key={editorKey}
            onSave={handleSave}
            placeholder={transtask("placeholdercontent")}
            userList={userList}
          />
        )}
      </Box>

      {comments.length > 0 && <CommentHistory comments={comments} mutate={mutate} />}
    </Box>
  );
};

export default TaskComments;

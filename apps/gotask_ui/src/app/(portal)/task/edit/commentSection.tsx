"use client";

import React, { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { SpeakerNotesOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useUser } from "@/app/userContext";
import useSWR from "swr";

import ReusableEditor from "@/app/component/richText/textEditor";
import CommentHistory from "./commentsHistory";
import { fetchUsers } from "../../user/services/userAction";
import { mapUsersToMentions } from "@/app/common/utils/textEditor";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { IComment } from "../interface/taskInterface";

interface CommentSectionProps {
  comments: IComment[];
  onSave: (html: string) => void;
  onUpdate: (comment: IComment) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onSave,
  onUpdate,
  onDelete
}) => {
  const transcmt = useTranslations(LOCALIZATION.TRANSITION.COMMENTS);
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { user } = useUser();
  const [editorKey, setEditorKey] = useState(0);

  const { data: fetchedUsers = [], isLoading } = useSWR("userList", fetchUsers);

  const userList = useMemo(() => {
    return mapUsersToMentions(fetchedUsers || []);
  }, [fetchedUsers]);

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
        <Typography fontWeight="bold">{transcmt("comment")}</Typography>
        <SpeakerNotesOutlined />
      </Box>

      <Box mt={1}>
        {isLoading ? (
          <Typography variant="body2" color="text.secondary">
            {transtask("loadinguser")}
          </Typography>
        ) : (
          <ReusableEditor key={editorKey} onSave={handleSave} userList={userList} />
        )}
      </Box>

      {comments?.length > 0 && (
        <CommentHistory
          comments={comments}
          onUpdate={onUpdate}
          onDelete={onDelete}
          userId={user?.id}
        />
      )}
    </Box>
  );
};

export default CommentSection;

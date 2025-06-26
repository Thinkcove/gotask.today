"use client";

import React, { useMemo, useState } from "react";
import { Box, Typography } from "@mui/material";
import { KeyedMutator } from "swr";
import { useTranslations } from "next-intl";
import { SpeakerNotesOutlined } from "@mui/icons-material";

import ReusableEditor from "@/app/component/richText/textEditor";
import { ProjectStory, Comment } from "../interfaces/projectStory";
import { fetchUsers } from "../../user/services/userAction";
import { mapUsersToMentions } from "@/app/common/utils/textEditor";
import { useUser } from "@/app/userContext";
import useSWR from "swr";

import {
  updateCommentOnProjectStory,
  deleteCommentFromProjectStory
} from "../services/projectStoryActions";

import StoryCommentHistory from "./StoryCommentHistory";

interface StoryCommentsProps {
  storyId: string;
  comments: Comment[];
  onSave: (comment: string) => void;
  mutate: KeyedMutator<ProjectStory>; 
}

const StoryComments: React.FC<StoryCommentsProps> = ({ storyId, comments, onSave, mutate }) => {
  const transCmt = useTranslations("Comments");
  const transStory = useTranslations("Projects.Stories");

  const [editorKey, setEditorKey] = useState(0);
  const { user } = useUser();

  const { data: fetchedUsers = [], isLoading } = useSWR("userList", fetchUsers);

  const userList = useMemo(() => mapUsersToMentions(fetchedUsers || []), [fetchedUsers]);

  const handleSave = (html: string) => {
    const trimmed = html.trim();
    if (trimmed) {
      onSave(trimmed);
      setEditorKey((prev) => prev + 1); 
    }
  };

  const handleUpdateComment = async (comment: Comment) => {
    await updateCommentOnProjectStory(comment.id, { comment: comment.comment });
    await mutate();
  };

  const handleDeleteComment = async (commentId: string) => {
    await deleteCommentFromProjectStory(commentId);
    await mutate();
  };

  return (
    <Box mt={3}>
      <Box sx={{ display: "flex", gap: 1, color: "#741B92", alignItems: "center" }}>
        <Typography fontWeight="bold">{transCmt("comment")}</Typography>
        <SpeakerNotesOutlined />
      </Box>

      <Box mt={1}>
        {isLoading ? (
          <Typography variant="body2" color="text.secondary">
            {transStory("loadinguser")}
          </Typography>
        ) : (
          <ReusableEditor key={editorKey} onSave={handleSave} userList={userList} />
        )}
      </Box>

      {comments?.length > 0 && (
        <StoryCommentHistory
          comments={comments}
          mutate={mutate}
          updateComment={handleUpdateComment}
          deleteComment={handleDeleteComment}
          currentUserId={user?.id}
          t={transCmt}
        />
      )}
    </Box>
  );
};

export default StoryComments;

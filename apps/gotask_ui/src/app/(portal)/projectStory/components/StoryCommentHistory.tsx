"use client";

import React, { useMemo, useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { getColorForUser } from "@/app/common/constants/avatar";
import CommonDialog from "@/app/component/dialog/commonDialog";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import ReusableEditor from "@/app/component/richText/textEditor";
import { getTipTapExtensions, mapUsersToMentions } from "@/app/common/utils/textEditor";
import useSWR from "swr";
import { fetchUsers } from "../../user/services/userAction";
import { Comment, ProjectStory } from "../interfaces/projectStory";

interface Props {
  comments: Comment[];
  mutate: any; // KeyedMutator<ProjectStory>
  updateComment: (comment: Comment) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  currentUserId?: string;
  t: ReturnType<typeof import("next-intl").useTranslations>;
}

const StoryCommentHistory: React.FC<Props> = ({
  comments,
  mutate,
  updateComment,
  deleteComment,
  currentUserId,
  t
}) => {
  const [showAll, setShowAll] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);

  const { data: fetchedUsers = [] } = useSWR("userList", fetchUsers);

  const userList = useMemo(() => {
    return mapUsersToMentions(fetchedUsers || []);
  }, [fetchedUsers]);

  const extensions = getTipTapExtensions();
  const displayedComments = showAll ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  const handleSaveEdit = async (html: string) => {
    if (editingComment) {
      await updateComment({ ...editingComment, comment: html });
      setEditingComment(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (commentToDelete) {
      await deleteComment(commentToDelete.id);
      setCommentToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Box mt={2}>
      <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
        {displayedComments.map((comment) => {
          const isOwner = currentUserId === comment.user_id;
          const isEditing = editingComment?.id === comment.id;

          return (
            <Box key={comment.id} sx={{ display: "flex", gap: 2, pt: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: getColorForUser(comment.user_name || ""),
                  width: 40,
                  height: 40
                }}
              >
                {comment.user_name?.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight="bold">
                  {comment.user_name} -{" "}
                  <Typography component="span" variant="caption" color="text.secondary">
                    <FormattedDateTime
                      date={comment.updatedAt ?? ""}
                      format={DateFormats.FULL_DATE_TIME_12H}
                    />
                  </Typography>
                </Typography>

                {isEditing ? (
                  <>
                    <ReusableEditor
                      content={comment.comment}
                      onSave={handleSaveEdit}
                      userList={userList}
                    />
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button onClick={() => setEditingComment(null)}>{t("cancel")}</Button>
                    </Box>
                  </>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: comment.comment }} />
                )}

                {isOwner && !isEditing && (
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ cursor: "pointer", color: "primary.main" }}
                      onClick={() => setEditingComment(comment)}
                    >
                      {t("commentedit")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        cursor: "pointer",
                        color: "#741B92",
                        "&:hover": { color: "#b71c1c" }
                      }}
                      onClick={() => {
                        setCommentToDelete(comment);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      {t("deletecomment")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {hasMoreComments && !showAll && (
        <Button onClick={() => setShowAll(true)} size="small">
          {t("viewMore")} ({comments.length - 3} more)
        </Button>
      )}
      {showAll && (
        <Button onClick={() => setShowAll(false)} size="small">
          {t("showless")}
        </Button>
      )}

      <CommonDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSubmit={handleDeleteConfirm}
        title={t("deletetitle")}
        submitLabel={t("deletecomment")}
        cancelLabel={t("cancelcomments")}
        submitColor="#b71c1c"
      >
        <Typography sx={{ pt: 2 }}>{t("commmentmessage")}</Typography>
      </CommonDialog>
    </Box>
  );
};

export default StoryCommentHistory;

import React, { useMemo, useState } from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { getColorForUser } from "@/app/common/constants/avatar";
import CommonDialog from "@/app/component/dialog/commonDialog";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import { RichTextReadOnly } from "mui-tiptap";
import ReusableEditor from "@/app/component/richText/textEditor";
import useSWR from "swr";
import { fetchUsers } from "../../user/services/userAction";
import { getTipTapExtensions, mapUsersToMentions } from "@/app/common/utils/textEditor";
import { IComment } from "../interface/taskInterface";

interface CommentHistoryProps {
  comments: IComment[];
  onUpdate: (updatedComment: any) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  userId?: string;
}

const CommentHistory: React.FC<CommentHistoryProps> = ({
  comments,
  onUpdate,
  onDelete,
  userId
}) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [showAll, setShowAll] = useState(false);
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<IComment | null>(null);

  const displayedComments = showAll ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  const { data: fetchedUsers = [] } = useSWR("userList", fetchUsers);
  const userList = useMemo(() => mapUsersToMentions(fetchedUsers), [fetchedUsers]);
  const extensions = getTipTapExtensions();

  const handleStartEdit = (comment: IComment) => setEditingComment(comment);

  const handleSaveEdit = async (html: string) => {
    if (editingComment && editingComment.id && html.trim()) {
      const updated = { ...editingComment, comment: html.trim() };
      await onUpdate(updated);
      setEditingComment(null);
    }
  };

  const handleDeleteClick = (comment: IComment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (commentToDelete?.id) {
      await onDelete(commentToDelete.id);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          maxHeight: { xs: 300, sm: 400, md: 500 },
          overflowY: "auto",
          overflowX: "hidden",
          pr: { xs: 0, sm: 1 },
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "#f1f1f1", borderRadius: "3px" },
          "&::-webkit-scrollbar-thumb": {
            background: "#741B92",
            borderRadius: "3px"
          },
          "&::-webkit-scrollbar-thumb:hover": { background: "#5a1472" }
        }}
      >
        {displayedComments.map((comment) => {
          const isOwner = userId === comment.user_id;
          const isEditing = editingComment?.id === comment.id;

          return (
            <Box key={comment.id} sx={{ display: "flex", gap: 2, pt: 2 }}>
              <Avatar
                sx={{
                  backgroundColor: getColorForUser(comment.user_name || ""),
                  width: 40,
                  height: 40,
                  flexShrink: 0
                }}
              >
                {comment.user_name.charAt(0)}
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
                      <Button
                        variant="outlined"
                        sx={{
                          color: "black",
                          border: "2px solid #741B92",
                          px: 2,
                          textTransform: "none",
                          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }
                        }}
                        onClick={() => setEditingComment(null)}
                      >
                        {transtask("cancelcomment")}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <RichTextReadOnly content={comment.comment} extensions={extensions} />
                )}

                {isOwner && !isEditing && (
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ cursor: "pointer", color: "primary.main" }}
                      onClick={() => handleStartEdit(comment)}
                    >
                      {transtask("commentedit")}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ cursor: "pointer", color: "#741B92", "&:hover": { color: "#b71c1c" } }}
                      onClick={() => handleDeleteClick(comment)}
                    >
                      {transtask("deletecomment")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {hasMoreComments && !showAll && (
        <Button onClick={() => setShowAll(true)} size="small" sx={{ textTransform: "none" }}>
          {transtask("viewMore", { default: "View more" })} ({comments.length - 3} more)
        </Button>
      )}
      {showAll && hasMoreComments && (
        <Button onClick={() => setShowAll(false)} size="small" sx={{ textTransform: "none" }}>
          {transtask("showless", { default: "Show less" })}
        </Button>
      )}

      <CommonDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSubmit={handleDeleteConfirm}
        title={transtask("deletetitle")}
        submitLabel={transtask("deletecomment")}
        cancelLabel={transtask("cancelcomments", { default: "Cancel" })}
        submitColor="#b71c1c"
      >
        <Typography sx={{ pt: 2 }}>{transtask("commmentmessage")}</Typography>
      </CommonDialog>
    </Box>
  );
};

export default CommentHistory;

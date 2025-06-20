import React, { useState } from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { ITask, ITaskComment } from "../interface/taskInterface";
import { getColorForUser } from "@/app/common/constants/avatar";
import { useUser } from "@/app/userContext";
import { updateComment, deleteComment } from "../service/taskAction";
import { KeyedMutator } from "swr";
import CommonDialog from "@/app/component/dialog/commonDialog";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import DOMPurify from "dompurify";
import RichEditor from "@/app/component/richText/richText";

interface CommentHistoryProps {
  comments: ITaskComment[];
  mutate: KeyedMutator<ITask>;
}

const CommentHistory: React.FC<CommentHistoryProps> = ({ comments, mutate }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [showAll, setShowAll] = useState(false);
  const { user } = useUser();
  const [editingComment, setEditingComment] = useState<ITaskComment | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<ITaskComment | null>(null);

  const handleStartEdit = (comment: ITaskComment) => {
    setEditingComment(comment);
    setEditValue(comment.comment);
  };

  const handleSaveEdit = async () => {
    if (editingComment && editingComment.id && editValue.trim()) {
      const updatedComment: ITaskComment = {
        ...editingComment,
        comment: editValue.trim()
      };

      await updateComment(updatedComment);
      setEditingComment(null);
      setEditValue("");
      await mutate();
    }
  };

  const handleDeleteClick = (comment: ITaskComment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (commentToDelete && commentToDelete.id) {
      await deleteComment(commentToDelete.id);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      await mutate();
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const displayedComments = showAll ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          maxHeight: { xs: 300, sm: 400, md: 500 },
          overflowY: "auto",
          overflowX: "hidden",
          pr: { xs: 0, sm: 1 },
          width: "100%",
          boxSizing: "border-box",
          "&::-webkit-scrollbar": {
            width: "6px"
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "3px"
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#741B92",
            borderRadius: "3px",
            opacity: 0.7
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#5a1472"
          }
        }}
      >
        {displayedComments.map((comment) => {
          const isOwner = user?.id === comment.user_id;
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
                    <RichEditor content={editValue} onUpdate={(html) => setEditValue(html)} />
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: "#741B92", textTransform: "none" }}
                        onClick={handleSaveEdit}
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
                          setEditingComment(null);
                          setEditValue("");
                        }}
                      >
                        {transtask("cancelcomment")}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{ mt: 1 }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.comment) }}
                  />
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
                      sx={{
                        cursor: "pointer",
                        color: "#741B92",
                        "&:hover": { color: "#b71c1c" }
                      }}
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
        <Button
          onClick={() => setShowAll(false)}
          size="small"
          sx={{
            textTransform: "none"
          }}
        >
          {transtask("showless", { default: "Show less" })}
        </Button>
      )}

      {/* Delete Confirmation Dialog using CommonDialog */}
      <CommonDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
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

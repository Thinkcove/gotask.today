import React, { useState } from "react";
import { Box, Button, Typography, Avatar } from "@mui/material";
import FormField from "@/app/component/input/formField";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { useTranslations } from "next-intl";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import DateFormats from "@/app/component/dateTime/dateFormat";
import { LOCALIZATION } from "@/app/common/constants/localization";
import {
  GoalComment,
  GoalCommentProps
} from "@/app/(portal)/goals/projectid/[projectId]/interface/projectGoal";

const GoalComments: React.FC<GoalCommentProps> = ({ comments, onSave, onEdit, onDelete }) => {
  const [editValue, setEditValue] = useState("");
  const [editingComment, setEditingComment] = useState<GoalComment | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<GoalComment | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);

  const handleSaveEdit = () => {
    if (editValue.trim() && editingComment?.id !== undefined && onEdit) {
      onEdit(editingComment.id, editValue.trim());
      setEditValue("");
      setEditingComment(null);
    }
  };

  const handleStartEdit = (comment: GoalComment) => {
    setEditingComment(comment);
    setEditValue(comment.comment);
  };

  const handleDeleteClick = (comment: GoalComment) => {
    setDeleteDialogOpen(true);
    setCommentToDelete(comment);
  };

  const handleDeleteConfirm = () => {
    if (commentToDelete?.id !== undefined && onDelete) {
      onDelete(commentToDelete.id);
    }
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const handlePostComment = () => {
    if (newComment.trim()) {
      onSave(newComment.trim());
      setNewComment("");
      setIsFocused(false);
    }
  };

  const displayedComments = showAll ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mt: 3 }}>
        <FormField
          label={transGoal("addcomment")}
          value={newComment}
          multiline
          height={100}
          onChange={(val) => setNewComment(val as string)}
          type="text"
          onFocus={() => setIsFocused(true)}
        />
        {isFocused && (
          <Box display="flex" gap={1} mt={1}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#741B92", textTransform: "none" }}
              onClick={handlePostComment}
            >
              {transGoal("savecomment")}
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
              {transGoal("cancelcomment")}
            </Button>
          </Box>
        )}
      </Box>

      {/* Comment List */}
      <Box
        sx={{
          maxHeight: { xs: 300, sm: 400, md: 500 },
          overflowY: "auto",
          overflowX: "hidden",
          pr: { xs: 0, sm: 1 },
          width: "100%",
          boxSizing: "border-box",
          "&::-webkit-scrollbar": { width: "6px" },
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
        {displayedComments.map((comment, index) => {
          const isEditing = editingComment && editingComment.id === comment.id;

          return (
            <Box key={comment.id || index} sx={{ display: "flex", gap: 2, pt: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight="bold">
                  {/* {comment.user_name} -{" "} */}
                  <Typography component="span" variant="caption" color="text.secondary">
                    <FormattedDateTime
                      date={comment?.updatedAt ?? ""}
                      format={DateFormats.FULL_DATE_TIME_12H}
                    />
                  </Typography>
                </Typography>

                {isEditing ? (
                  <>
                    <FormField
                      label=""
                      type="text"
                      value={editValue}
                      multiline
                      height={100}
                      onChange={(val) => setEditValue(val as string)}
                    />
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#741B92",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#5a1472" }
                        }}
                        onClick={handleSaveEdit}
                      >
                        {transGoal("update")}
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
                        {transGoal("cancelcomment")}
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{comment.comment}</Typography>
                )}

                {!isEditing && (
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ cursor: "pointer", color: "primary.main" }}
                      onClick={() => handleStartEdit(comment)}
                    >
                      {transGoal("commentedit")}
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
                      {transGoal("deletecomment")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* View more / less */}
      {hasMoreComments && !showAll && (
        <Button onClick={() => setShowAll(true)} size="small" sx={{ textTransform: "none" }}>
          {transGoal("viewMore", { default: "View more" })} ({comments.length - 3} more)
        </Button>
      )}
      {showAll && hasMoreComments && (
        <Button onClick={() => setShowAll(false)} size="small" sx={{ textTransform: "none" }}>
          {transGoal("showless", { default: "Show less" })}
        </Button>
      )}

      {/* Delete confirmation dialog */}
      <CommonDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onSubmit={handleDeleteConfirm}
        title={transGoal("deletetitle")}
        submitLabel={transGoal("deletecomment")}
        cancelLabel={transGoal("cancelcomment")}
        submitColor="#b71c1c"
      >
        <Typography sx={{ pt: 2 }}>{transGoal("commmentmessage")}</Typography>
      </CommonDialog>
    </Box>
  );
};

export default GoalComments;

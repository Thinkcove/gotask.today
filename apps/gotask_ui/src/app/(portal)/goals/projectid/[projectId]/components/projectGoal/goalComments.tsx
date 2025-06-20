import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);

  const handleSaveEdit = () => {
    if (editValue.trim() && editingCommentId && onEdit) {
      onEdit(editingCommentId, editValue.trim());
      setEditValue("");
      setEditingCommentId(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (commentToDeleteId && onDelete) {
      onDelete(commentToDeleteId);
    }
    setDeleteDialogOpen(false);
    setCommentToDeleteId(null);
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
      {/* New Comment Input */}
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
          pr: { xs: 0, sm: 1 },
          width: "100%",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "3px"
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#741B92",
            borderRadius: "3px"
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#5a1472"
          }
        }}
      >
        {displayedComments.flatMap((item) => {
          if (Array.isArray(item.comment)) {
            return item.comment.map((text: string, idx: number) => {
              const commentId = `${item.id}-${idx}`;
              const isEditing = editingCommentId === commentId;

              return (
                <Box key={commentId} sx={{ display: "flex", gap: 2, pt: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight="bold">
                      {item.user_name}{" "}
                      <Typography component="span" variant="caption" color="text.secondary">
                        <FormattedDateTime
                          date={item?.updatedAt ?? ""}
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
                              textTransform: "none"
                            }}
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditValue("");
                            }}
                          >
                            {transGoal("cancelcomment")}
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{text}</Typography>
                    )}

                    {!isEditing && (
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ cursor: "pointer", color: "primary.main" }}
                          onClick={() => {
                            setEditValue(text);
                            setEditingCommentId(commentId);
                          }}
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
                          onClick={() => {
                            setDeleteDialogOpen(true);
                            setCommentToDeleteId(commentId);
                          }}
                        >
                          {transGoal("deletecomment")}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            });
          } else if (typeof item.comment === "string") {
            // fallback for single string comments
            const commentId = `${item.id}-0`;
            const isEditing = editingCommentId === commentId;
            const text = item.comment;

            return (
              <Box key={commentId} sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight="bold">
                    {item.user_name}{" "}
                    <Typography component="span" variant="caption" color="text.secondary">
                      <FormattedDateTime
                        date={item?.updatedAt ?? ""}
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
                            textTransform: "none"
                          }}
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditValue("");
                          }}
                        >
                          {transGoal("cancelcomment")}
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>{text}</Typography>
                  )}

                  {!isEditing && (
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ cursor: "pointer", color: "primary.main" }}
                        onClick={() => {
                          setEditValue(text);
                          setEditingCommentId(commentId);
                        }}
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
                        onClick={() => {
                          setDeleteDialogOpen(true);
                          setCommentToDeleteId(commentId);
                        }}
                      >
                        {transGoal("deletecomment")}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          }

          return null;
        })}
      </Box>

      {/* View More / Less */}
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

      {/* Delete Dialog */}
      <CommonDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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

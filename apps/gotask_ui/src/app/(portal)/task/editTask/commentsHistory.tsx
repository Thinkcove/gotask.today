import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { SpeakerNotesOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { ITask, ITaskComment } from "../interface/taskInterface";
import { getColorForUser } from "@/app/common/constants/avatar";
import { KeyedMutator } from "swr";

interface CommentHistoryProps {
  comments: ITaskComment[];
  onEdit: (comment: ITaskComment) => void;
  canEditId: string;
  mutate?: KeyedMutator<ITask>;
}

const CommentHistory: React.FC<CommentHistoryProps> = ({ comments, onEdit, canEditId, mutate }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [showAll, setShowAll] = useState(false);
  const [editingComment, setEditingComment] = useState<ITaskComment | null>(null);
  const [editText, setEditText] = useState("");

  if (comments.length === 0) return null;

  const displayedComments = showAll ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  const handleEditComment = (comment: ITaskComment) => {
    setEditingComment(comment);
    setEditText(comment.comment);
  };

  const handleSaveEdit = async (comment: ITaskComment) => {
    if (!editText.trim()) return;

    try {
      const commentData: ITaskComment = {
        ...comment,
        comment: editText,
      };
      await onEdit(commentData);
      setEditingComment(null);
      setEditText("");
      if (mutate) await mutate();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
  };

  return (
    <Box
      sx={{
        mt: 2,
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          color: "#741B92",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography fontWeight="bold">{transtask("comment")}</Typography>
        <SpeakerNotesOutlined />
      </Box>

      <Box
        sx={{
          maxHeight: { xs: 300, sm: 400, md: 500 },
          overflowY: "auto",
          overflowX: "hidden",
          pr: { xs: 0, sm: 1 },
          width: "100%",
          boxSizing: "border-box",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#741B92",
            borderRadius: "3px",
            opacity: 0.7,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#5a1472",
          },
        }}
      >
        {displayedComments.map((comment) => (
          <Box
            key={comment.id}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: { xs: 1, sm: 2 },
              py: { xs: 1.5, sm: 2 },
              pr: { xs: 0, sm: 2 },
              my: 1,
              width: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <Avatar
              sx={{
                backgroundColor: getColorForUser

                  (comment.user_name || ""),
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                flexShrink: 0,
              }}
            >
              {comment.user_name.charAt(0)}
            </Avatar>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  mb: 0.5,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    lineHeight: 1.2,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: { xs: "normal", sm: "nowrap" },
                  }}
                >
                  {comment.user_name} -
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                >
                  {new Date(comment.createdAt ?? new Date().toISOString()).toLocaleString()}
                </Typography>
              </Box>

              {editingComment?.id === comment.id ? (
                <Box>
                  <TextField
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    sx={{
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        "& fieldset": {
                          borderColor: "#e0e0e0",
                          borderWidth: "1px",
                        },
                        "&:hover fieldset": {
                          borderColor: "#ccc",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputBase-input": {
                        fontSize: "0.875rem",
                        color: "#333",
                        padding: "12px",
                      },

                    }}
                  />
                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#741B92",
                        color: "white",
                        textTransform: "none",
                        fontWeight: 500,
                        px: 3,
                        py: 1,
                        borderRadius: "6px",
                      }}
                      onClick={() => handleSaveEdit(comment)}
                    >
                      {transtask("savecomments")}
                    </Button>
                    <Button
                      variant="text"
                      sx={{
                        color: "#741B92",
                        textTransform: "none",
                        fontWeight: 500,
                        px: 3,
                        py: 1,
                      }}
                      onClick={handleCancelEdit}
                    >
                      {transtask("cancelcomments")}
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "0.875rem" },
                      lineHeight: 1.4,
                      whiteSpace: "pre-line", // Enables \n breaks
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      hyphens: "auto",
                      mb: 1,
                    }}
                  >
                    {comment.comment}</Typography>

                  {String(comment.user_id) === String(canEditId) && (
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => handleEditComment(comment)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        p: 0,
                        minWidth: "auto",
                        "&:hover": {
                          textDecoration: "underline",
                          backgroundColor: "transparent",
                        },
                        "&:active": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {transtask("editcomment", { default: "Edit" })}
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Box>
        ))}
      </Box>

      {hasMoreComments && !showAll && (
        <Button
          onClick={() => setShowAll(true)}
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 500,
            p: 0,
            minWidth: "auto",
            "&:hover": {
              textDecoration: "underline",
              backgroundColor: "transparent",
            },
            "&:active": {
              textDecoration: "underline",
            },
          }}
        >
          {transtask("viewMore", { default: "View more" })} ({comments.length - 3} more)
        </Button>
      )}

      {showAll && hasMoreComments && (
        <Button
          onClick={() => setShowAll(false)}
          size="small"
          sx={{
            textTransform: "none",
            ml: { xs: 0, sm: 6 },
            mt: 1,
            fontSize: { xs: "0.875rem", sm: "0.875rem" },
            alignSelf: "flex-start",
          }}
        >
          {transtask("showLess", { default: "Show less" })}
        </Button>
      )}
    </Box>
  );
};

export default CommentHistory;

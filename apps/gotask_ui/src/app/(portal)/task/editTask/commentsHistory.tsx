import React, { useState } from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { SpeakerNotesOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { ITaskComment } from "../interface/taskInterface";

interface CommentHistoryProps {
  comments: ITaskComment[];
  onEdit: (comment: ITaskComment) => void; // Updated to pass the selected comment
  canEditId: string; // Logged-in user ID to check edit eligibility
}

const CommentHistory: React.FC<CommentHistoryProps> = ({ comments, onEdit, canEditId }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [showAll, setShowAll] = useState(false);

  if (comments.length === 0) return null;

  const displayedComments = showAll ? comments : comments.slice(0, 3);
  const hasMoreComments = comments.length > 3;

  return (
    <Box
      sx={{
        mt: 2,
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%"
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1,
          color: "#741B92",
          alignItems: "center",
          mb: 2
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
              overflow: "hidden"
            }}
          >
            <Avatar
              sx={{
                backgroundColor: "#741B92",
                width: { xs: 32, sm: 40 },
                height: { xs: 32, sm: 40 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
                flexShrink: 0
              }}
            >
              {comment.user_name.charAt(0)}
            </Avatar>
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                overflow: "hidden"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  mb: 0.5
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
                    whiteSpace: { xs: "normal", sm: "nowrap" }
                  }}
                >
                  {comment.user_name} -
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    color: "text.secondary",
                    flexShrink: 0
                  }}
                >
                  {new Date(comment.createdAt ?? new Date().toISOString()).toLocaleString()}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.875rem", sm: "0.875rem" },
                  lineHeight: 1.4,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  hyphens: "auto",
                  mb: 1
                }}
              >
                {comment.comment}
              </Typography>
              {String(comment.user_id) === String(canEditId) && (
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => onEdit(comment)} // Pass the entire comment object
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    p: 0,
                    minWidth: "auto",
                    "&:hover": {
                      textDecoration: "underline",
                      backgroundColor: "transparent"
                    },
                    "&:active": {
                      textDecoration: "underline"
                    }
                  }}
                >
                  {transtask("addcomment")} {/* Updated label to indicate edit */}
                </Button>
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
              backgroundColor: "transparent"
            },
            "&:active": {
              textDecoration: "underline"
            }
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
            alignSelf: "flex-start"
          }}
        >
          {transtask("showLess", { default: "Show less" })}
        </Button>
      )}
    </Box>
  );
};

export default CommentHistory;

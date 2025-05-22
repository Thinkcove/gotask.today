import React, { useState, useRef } from "react";
import { Box, Avatar, Typography, Button } from "@mui/material";
import { SpeakerNotesOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { ITaskComment } from "../interface/taskInterface";

interface CommentHistoryProps {
  comments: ITaskComment[];
}

const CommentHistory: React.FC<CommentHistoryProps> = ({ comments }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [visibleCount, setVisibleCount] = useState(3);
  const [enableScrollLoad, setEnableScrollLoad] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || !enableScrollLoad) return;

    const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 10;

    if (nearBottom && visibleCount < comments.length) {
      setVisibleCount((prev) => Math.min(prev + 3, comments.length));
    }
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, comments.length));
    setEnableScrollLoad(true);
  };

  if (comments.length === 0) return null;

  return (
    <Box mt={2}>
      <Box sx={{ display: "flex", gap: 1, color: "#741B92" }}>
        <Typography fontWeight="bold">{transtask("comment")}</Typography>
        <SpeakerNotesOutlined />
      </Box>

      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          maxHeight: enableScrollLoad ? 300 : "auto", // Limit height when scroll enabled
          overflowY: enableScrollLoad ? "auto" : "visible",
          pr: 1,
          mt: 1
        }}
      >
        {comments.slice(0, visibleCount).map((comment) => (
          <Box key={comment.id} display="flex" alignItems="flex-start" gap={2} py={2} pr={2} my={1}>
            <Avatar sx={{ backgroundColor: "#741B92" }}>{comment.user_name.charAt(0)}</Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {comment.user_name} -
                </Typography>
                <Typography variant="subtitle2">
                  {new Date(comment.createdAt ?? new Date().toISOString()).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2">{comment.comment}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {comments.length > visibleCount && !enableScrollLoad && (
        <Button onClick={handleViewMore} size="small" sx={{ textTransform: "none", ml: 6, mt: 1 }}>
          {transtask("viewMore", { default: "View more" })}
        </Button>
      )}
    </Box>
  );
};

export default CommentHistory;

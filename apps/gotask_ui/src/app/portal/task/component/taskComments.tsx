import React, { useState } from "react";
import { Box, Button, Avatar, Typography } from "@mui/material";
import FormField from "@/app/component/formField";
import { SpeakerNotesOutlined } from "@mui/icons-material";

interface Comment {
  id: string;
  user_name: string;
  comment: string;
  createdAt: string;
}

interface TaskCommentsProps {
  comments: Comment[];
  onSave: (comment: string) => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onSave }) => {
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSave = () => {
    if (newComment.trim()) {
      onSave(newComment);
      setNewComment("");
      setIsFocused(false);
    }
  };

  return (
    <Box sx={{ mb: 5 }}>
      {/* Comment Input Field */}
      <FormField
        label="Add a Comment"
        type="text"
        placeholder="Write a comment..."
        value={newComment}
        onChange={(value) => setNewComment(value as string)}
        multiline
        height={80}
        onFocus={() => setIsFocused(true)}
      />

      {/* Save and Cancel Buttons */}
      {isFocused && (
        <Box display="flex" gap={1} mt={1}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#741B92", textTransform: "none" }}
            onClick={handleSave}
          >
            Save Comment
          </Button>
          <Button
            variant="outlined"
            sx={{
              color: "black",
              border: "2px solid #741B92",
              px: 2,
              textTransform: "none",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            }}
            onClick={() => {
              setNewComment("");
              setIsFocused(false);
            }}
          >
            Cancel
          </Button>
        </Box>
      )}

      {/* Previous Comments */}

      {comments.length > 0 && (
        <Box mt={2}>
          <Box sx={{ display: "flex", gap: 1, color: "#741B92" }}>
            <Typography fontWeight="bold">Comments</Typography>
            <SpeakerNotesOutlined />
          </Box>
          {comments.map((comment) => (
            <Box
              key={comment.id}
              display="flex"
              alignItems="flex-start"
              gap={2}
              py={2}
              pr={2}
              my={1}
            >
              <Avatar sx={{ backgroundColor: "#741B92" }}>
                {comment.user_name.charAt(0)}
              </Avatar>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {comment.user_name} -
                  </Typography>
                  <Typography variant="subtitle2">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body2">{comment.comment}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TaskComments;

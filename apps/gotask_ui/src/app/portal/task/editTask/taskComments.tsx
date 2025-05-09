import React, { useEffect, useState } from "react";
import { Box, Button, Avatar, Typography } from "@mui/material";
import FormField from "@/app/component/formField";
import { SpeakerNotesOutlined } from "@mui/icons-material";
import { ITaskComment } from "../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { fetchAllUsers } from "../service/taskAction";

interface TaskCommentsProps {
  comments: ITaskComment[];
  onSave: (comment: string) => void;
}
type UserType = {
  id: string;
  name: string;
};

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, onSave }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const [newComment, setNewComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { getAllUsers } = fetchAllUsers();

  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [mentionQuery, setMentionQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers(); // Assuming it returns [{ id, name }]
      setAllUsers(users);
    };
    fetchUsers();
  }, []);
  const handleCommentChange = (value: string) => {
    setNewComment(value);

    const match = value.slice(0, value.length).match(/@(\w*)$/);
    if (match) {
      const query = match[1].toLowerCase();
      const filtered = allUsers.filter((user) => user.name.toLowerCase().includes(query));
      setMentionQuery(query);
      setFilteredUsers(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };
  const handleMentionSelect = (user: UserType) => {
    const updatedComment = newComment.replace(/@(\w*)$/, `(user_id:"${user.id}")`);
    setNewComment(updatedComment);
    setShowSuggestions(false);
    setMentionQuery("");
  };

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
        label="Comment"
        type="text"
        value={newComment}
        onChange={(value) => {
          setNewComment(value as string);
          const match = (value as string).match(/@(\w*)$/);
          if (match) {
            setMentionQuery(match[1]);
            setShowDropdown(true);
          } else {
            setShowDropdown(false);
          }
        }}
        onFocus={() => setIsFocused(true)}
        multiline
      />
      {showDropdown && (
        <Box
          sx={{ position: "absolute", background: "white", border: "1px solid #ccc", zIndex: 10 }}
        >
          {filteredUsers.map((user) => (
            <Box
              key={user.id}
              onClick={() => handleMentionSelect(user.name)}
              sx={{ padding: 1, cursor: "pointer" }}
            >
              {user.name}
            </Box>
          ))}
        </Box>
      )}

      {/* Save and Cancel Buttons */}
      {isFocused && (
        <Box display="flex" gap={1} mt={1}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#741B92", textTransform: "none" }}
            onClick={handleSave}
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
              setNewComment("");
              setIsFocused(false);
            }}
          >
            {transtask("cancelcomment")}
          </Button>
        </Box>
      )}

      {/* Previous Comments */}

      {comments.length > 0 && (
        <Box mt={2}>
          <Box sx={{ display: "flex", gap: 1, color: "#741B92" }}>
            <Typography fontWeight="bold">{transtask("comments")}</Typography>
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
      )}
    </Box>
  );
};

export default TaskComments;

import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import GroupIcon from "@mui/icons-material/Group";

interface TaskToggleProps {
  view: "projects" | "users";
  onViewChange: (view: "projects" | "users") => void;
}

const TaskToggle: React.FC<TaskToggleProps> = ({ view, onViewChange }) => {
  const buttons = [
    { key: "projects", icon: <FolderIcon fontSize="small" />, label: "Projects" },
    { key: "users", icon: <GroupIcon fontSize="small" />, label: "Users" }
  ];

  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {buttons.map(({ key, icon, label }) => {
        const selected = view === key;
        return (
          <Tooltip key={key} title={label} arrow>
            <IconButton
              onClick={() => onViewChange(key as "projects" | "users")}
              size="small"
              sx={{
                backgroundColor: selected ? "#741B92" : "transparent",
                color: selected ? "#fff" : "#666",
                "&:hover": {
                  backgroundColor: selected ? "#741B92" : "#eee"
                },
                borderRadius: 1
              }}
            >
              {icon}
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default TaskToggle;

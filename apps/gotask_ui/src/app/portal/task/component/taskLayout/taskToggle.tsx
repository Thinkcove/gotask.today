import React from "react";
import { Box, Typography, Switch } from "@mui/material";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface TaskToggleProps {
  view: "projects" | "users";
  setView: React.Dispatch<React.SetStateAction<"projects" | "users">>;
}

const TaskToggle: React.FC<TaskToggleProps> = ({ view, setView }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography fontWeight="bold" color="#333">
            {view === "projects" ? transtask("projects") : transtask("assignees")}
          </Typography>
          <Switch
            checked={view === "users"}
            onChange={() => setView(view === "projects" ? "users" : "projects")}
            sx={{
              "& .MuiSwitch-switchBase": { color: "#fff" },
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#741B92" },
              "& .MuiSwitch-track": { backgroundColor: "#B1AAAA", opacity: 1 },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#741B92"
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TaskToggle;

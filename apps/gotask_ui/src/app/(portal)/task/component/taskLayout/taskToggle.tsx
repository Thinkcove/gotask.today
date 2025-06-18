import React from "react";
import { Box } from "@mui/material";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface TaskToggleProps {
  view: "projects" | "users";
  onViewChange: (view: "projects" | "users" ) => void;
}

const TaskToggle: React.FC<TaskToggleProps> = ({ view, onViewChange }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        position: "relative",
        borderBottom: "2px solid #eee",
        width: "fit-content",
        marginBottom: "4px"
      }}
    >
      {["projects", "users"].map((key) => (
        <Box
          key={key}
          onClick={() => onViewChange(key as "projects" | "users")}
          sx={{
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: view === key ? 600 : 400,
            color: view === key ? "#741B92" : "#555",
            paddingBottom: "4px",
            transition: "color 0.2s"
          }}
        >
          {transtask(key)}
        </Box>
      ))}

      {/* Animated underline */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: view === "projects" ? 0 : "calc(100% / 2)",
          width: "50%",
          height: "2px",
          backgroundColor: "#741B92",
          transition: "left 0.3s ease"
        }}
      />
    </Box>
  );
};

export default TaskToggle;

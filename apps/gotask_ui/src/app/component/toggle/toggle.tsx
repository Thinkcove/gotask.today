import React from "react";
import { Box } from "@mui/material";

interface ToggleProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

const TaskToggle: React.FC<ToggleProps> = ({ options, selected, onChange }) => {
  const selectedIndex = options.indexOf(selected);

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
      {options.map((option) => (
        <Box
          key={option}
          onClick={() => onChange(option)}
          sx={{
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: selected === option ? 600 : 400,
            color: selected === option ? "#741B92" : "#555",
            paddingBottom: "4px",
            transition: "color 0.2s"
          }}
        >
          {option}
        </Box>
      ))}

      {/* Animated underline */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: `${(100 / options.length) * selectedIndex}%`,
          width: `${100 / options.length}%`,
          height: "2px",
          backgroundColor: "#741B92",
          transition: "left 0.3s ease"
        }}
      />
    </Box>
  );
};

export default TaskToggle;

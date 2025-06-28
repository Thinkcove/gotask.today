import React from "react";
import { Box } from "@mui/material";

interface ToggleProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

const Toggle: React.FC<ToggleProps> = ({ options, selected, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "fit-content",
        gap: 4
      }}
    >
      {options.map((option) => {
        const isSelected = selected === option;
        return (
          <Box
            key={option}
            onClick={() => onChange(option)}
            sx={{
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? "#741B92" : "#555",
              paddingBottom: "4px",
              borderBottom: isSelected ? "2px solid #741B92" : "2px solid transparent",
              transition: "color 0.2s, border-bottom 0.3s"
            }}
          >
            {option}
          </Box>
        );
      })}
    </Box>
  );
};

export default Toggle;

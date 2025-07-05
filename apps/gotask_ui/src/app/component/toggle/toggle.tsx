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
        overflowX: "auto",
        width: "100%",
        whiteSpace: "nowrap",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          height: "6px"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#ccc",
          borderRadius: "4px"
        }
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          gap: 4,
          px: 1
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
    </Box>
  );
};

export default Toggle;

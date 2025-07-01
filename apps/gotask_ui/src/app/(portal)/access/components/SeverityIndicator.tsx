import React from "react";
import { Box } from "@mui/material";

interface SeverityIndicatorProps {
  severity: string;
  getColor: (severity: string) => string;
}

const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({ severity, getColor }) => {
  const color = getColor(severity);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color} 30%, #fff 100%)`,
          boxShadow: `0 0 6px ${color}`
        }}
      />
      <Box
        sx={{
          fontSize: 12,
          fontWeight: 600,
          color,
          textTransform: "uppercase"
        }}
      >
        {severity}
      </Box>
    </Box>
  );
};

export default SeverityIndicator;

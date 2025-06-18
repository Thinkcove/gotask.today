import React from "react";
import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatTimeValue } from "@/app/common/utils/taskTime";

interface TimeBadgeProps {
  label: string;
  value: string;
}

const TimeBadge: React.FC<TimeBadgeProps> = ({ label, value }) => {
  const formattedValue = formatTimeValue(value);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <AccessTimeIcon sx={{ fontSize: 14, color: "text.disabled" }} />
      <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
        {label}:
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontWeight: 500, fontSize: "0.72rem", color: "text.primary" }}
      >
        {formattedValue}
      </Typography>
    </Box>
  );
};

export default TimeBadge;

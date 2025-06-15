"use client";

import React from "react";
import { Chip } from "@mui/material";

interface StatusLabelChipProps {
  label: string;
  color?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
  size?: "small" | "medium";
  variant?: "outlined" | "filled";
  sx?: object;
}

const StatusLabelChip: React.FC<StatusLabelChipProps> = ({
  label,
  color = "default",
  size = "small",
  variant = "outlined",
  sx = {}
}) => {
  return (
    <Chip
      label={label}
      color={color}
      size={size}
      variant={variant}
      sx={{
        fontWeight: 500,
        fontSize: "0.75rem",
        textTransform: "capitalize",
        ...sx
      }}
    />
  );
};

export default StatusLabelChip;

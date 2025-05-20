// components/TimeBadge.tsx

import React from "react";
import { Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatTimeValue } from "@/app/common/utils/common";

interface TimeBadgeProps {
  label: string;
  value: string;
}

const TimeBadge: React.FC<TimeBadgeProps> = ({ label, value }) => {
  const formattedValue = formatTimeValue(value);

  return (
    <Chip
      icon={<AccessTimeIcon fontSize="small" />}
      label={`${label}: ${formattedValue}`}
      variant="outlined"
      sx={{ borderRadius: 1 }}
    />
  );
};

export default TimeBadge;

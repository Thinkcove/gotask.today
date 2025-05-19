// components/TimeBadge.tsx

import React from "react";
import { Chip } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface TimeBadgeProps {
  label: string;
  value: string;
}

const formatTimeValue = (raw: string): string => {
  const dayMatch = raw.match(/(\d+)d/);
  const hourMatch = raw.match(/(\d+)h/);

  const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;

  if (days === 0 && hours === 0) return "—";
  if (days === 0) return `${hours}h`;
  if (hours === 0) return `${days}d`;
  return `${days}d${hours}h`;
};

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

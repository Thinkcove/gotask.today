import { Box, Typography } from "@mui/material";
import React from "react";
import { timeStatusItems as defaultTimeStatusItems } from "@/app/common/constants/actualTime";

interface TimeStatusItem {
  color: string;
  label: string;
}

interface TimeSpentStatusProps {
  items?: TimeStatusItem[];
}

export const TimeSpentStatus: React.FC<TimeSpentStatusProps> = ({
  items = defaultTimeStatusItems
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        justifyContent: "center",
        mb: 2,
        flexWrap: "wrap"
      }}
    >
      {items.map((item, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, lineHeight: 1 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: item.color,
              flexShrink: 0,
              transform: "translateY(-1px)"
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.75rem",
              color: "#666",
              lineHeight: 1
            }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

import React from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";

interface StatusIndicatorProps {
  status: string;
  getColor?: (status: string) => string;
  dotSize?: number;
  capitalize?: boolean;
  textColor?: string;
  sx?: SxProps<Theme>;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  getColor = () => "gray",
  dotSize = 10,
  capitalize = true,
  textColor,
  sx = {}
}) => {
  const color = textColor || getColor(status);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ...sx
      }}
    >
      <Box
        sx={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          backgroundColor: getColor(status),
          mr: 1
        }}
      />
      <Typography
        sx={{
          color,
          textTransform: capitalize ? "capitalize" : "none",
          textWrap:"nowrap"
        }}
      >
        {status}
      </Typography>
    </Box>
  );
};

export default StatusIndicator;

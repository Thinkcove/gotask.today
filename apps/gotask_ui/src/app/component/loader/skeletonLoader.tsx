import React from "react";
import { Box, Skeleton } from "@mui/material";

interface SkeletonLoaderProps {
  count?: number;
  width?: number | string;
  height?: number | string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 5, width = 220, height = 42 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "nowrap",
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" }
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width={width}
          height={height}
          sx={{ borderRadius: 1 }}
          animation="wave"
        />
      ))}
    </Box>
  );
};

export default SkeletonLoader;

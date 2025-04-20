import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

interface EmptyStateProps {
  imageSrc: string;
  message: string;
  subText?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ imageSrc, message, subText }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="70vh"
      px={2}
    >
      {/* 🖼 Image */}
      <Box mb={2} sx={{ position: "relative", zIndex: 2 }}>
        <Image
          src={imageSrc}
          alt="Empty state illustration"
          width={300}
          height={240}
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </Box>

      {/* 💬 Text */}
      <Typography
        variant="h6"
        color="text.primary"
        align="center"
        sx={{ zIndex: 2, position: "relative" }}
      >
        {message}
      </Typography>
      {subText && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 1, zIndex: 2, position: "relative" }}
        >
          {subText}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;

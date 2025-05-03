import React from "react";
import { Box, SxProps, Theme } from "@mui/material";

interface CardComponentProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const CardComponent: React.FC<CardComponentProps> = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: "linear-gradient(145deg, #ffffff, #f7f3fa)",
        border: "2px solid #eee",
        p: 2,
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
        ...sx // override or extend styles
      }}
    >
      {children}
    </Box>
  );
};

export default CardComponent;

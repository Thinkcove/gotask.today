import React from "react";
import { Typography, Box } from "@mui/material";

interface AccessHeadingProps {
  title?: string;
}

const AccessHeading: React.FC<AccessHeadingProps> = ({ title = "Access" }) => {
  return (
    <Box sx={{ }}>
      <Typography
        variant="h4"  // This will use a predefined Material UI typography style for headings
        component="h1"
        color="textPrimary"  // Ensures the text color matches the theme's primary text color
        fontWeight="bold"  // Equivalent to font-semibold in Tailwind
      >
        {title}
      </Typography>
    </Box>
  );
};

export default AccessHeading;

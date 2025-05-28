import React from "react";
import { Typography, Box } from "@mui/material";

interface AccessHeadingProps {
  title?: string;
}

const AccessHeading: React.FC<AccessHeadingProps> = ({ title = "Access" }) => {
  return (
    <Box sx={{ }}>
      <Typography
        variant="h4" 
        component="h2"
        color="textPrimary"  
        fontWeight="bold"  
      >
        {title}
      </Typography>
    </Box>
  );
};

export default AccessHeading;

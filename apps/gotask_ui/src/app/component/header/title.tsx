import React from "react";
import { Typography, Box } from "@mui/material";

interface HeadingProps {
  title?: string;
}

const Heading: React.FC<HeadingProps> = ({ title }) => {
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

export default Heading;

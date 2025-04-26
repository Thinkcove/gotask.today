import React from "react";
import { Box, Typography } from "@mui/material";

interface ModuleHeaderProps {
  name: string;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({ name }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#741B92",
        color: "white",
        p: 1.5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "600",
          textTransform: "capitalize"
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

export default ModuleHeader;

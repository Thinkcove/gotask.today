import { AppBar, Box, Typography } from "@mui/material";
import React from "react";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1100,
        width: "100%",
        backgroundColor: "#741B92",
        py: 2,
        px: 5,
      }}
    >
      <Box display="flex" alignItems="center">
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "white" }}
        >
          Go Task Today
        </Typography>
      </Box>
    </AppBar>
  );
};

export default Header;

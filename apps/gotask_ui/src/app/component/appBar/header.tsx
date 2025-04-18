"use client";
import React, { useState } from "react";
import { AppBar, Box, Typography, Avatar } from "@mui/material";
import { useUser } from "@/app/userContext";
import UserMenu from "./userMenu";

const Header = () => {
  const { user, logout } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1100,
          width: "100%",
          backgroundColor: "#741B92",
          py: 2,
          px: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "white", mb: 0 }}
          >
            Go Task Today
          </Typography>

          {/* Avatar and User Menu */}
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                backgroundColor: "#fff",
                color: "#741B92",
                cursor: "pointer",
                height: 32,
                width: 32,
              }}
              onClick={handleClick}
            >
              {firstLetter}
            </Avatar>

            <UserMenu
              anchorEl={anchorEl}
              handleClose={handleClose}
              handleLogout={handleLogout}
              user={user}
            />
          </Box>
        </Box>
      </AppBar>
      <Box sx={{ flexGrow: 1, pb: "70px" }} />
    </>
  );
};

export default Header;

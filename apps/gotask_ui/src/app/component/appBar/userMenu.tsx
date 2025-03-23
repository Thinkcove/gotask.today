import React from "react";
import { Menu, MenuItem, Box, Typography, Divider } from "@mui/material";
import { Logout } from "@mui/icons-material";

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleLogout: () => void;
  user: {
    name?: string;
    role?: string;
    status?: boolean;
  } | null;
}

const UserMenu: React.FC<UserMenuProps> = ({
  anchorEl,
  handleClose,
  handleLogout,
  user,
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      MenuListProps={{ "aria-labelledby": "basic-button" }}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "12px", // Applied border radius
          padding: "8px",
        },
      }}
    >
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography
          variant="h6"
          fontWeight="semibold"
          sx={{ textTransform: "capitalize" }}
        >
          {user?.name}
        </Typography>
        <Typography sx={{ textTransform: "capitalize" }}>
          {user?.role}
        </Typography>
        <Typography sx={{ color: user?.status ? "green" : "grey" }}>
          {user?.status ? "Active" : "Inactive"}
        </Typography>
      </Box>
      <Divider />
      <MenuItem
        onClick={handleLogout}
        sx={{
          justifyContent: "center",
          fontWeight: "bold",
          color: "#741B92",
        }}
      >
        <Logout sx={{ mr: 1 }} /> Logout
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;

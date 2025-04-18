import React from "react";
import {
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { Logout, Person, Work, CheckCircle, Cancel } from "@mui/icons-material";

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleLogout: () => void;
  user: {
    id?: string;
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
      MenuListProps={{
        "aria-labelledby": "basic-button",
        disablePadding: true,
      }}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "12px",
          padding: "12px",
          minWidth: "240px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {/* User Info Section */}
      <Box>
        {/* Name */}
        <Box display="flex" alignItems="center" gap={1}>
          <Person sx={{ fontSize: 18 }} />
          <Typography
            variant="body1"
            color="text.primary"
            fontWeight="bold"
            sx={{ textTransform: "capitalize" }}
          >
            {user?.name}
          </Typography>
        </Box>

        {/* Role */}
        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
          <Work sx={{ fontSize: 18, color: "grey" }} />
          <Typography variant="body2" color="text.secondary">
            {user?.role}
          </Typography>
        </Box>

        {/* Status */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          {user?.status ? (
            <CheckCircle sx={{ fontSize: 18, color: "green" }} />
          ) : (
            <Cancel sx={{ fontSize: 18, color: "grey" }} />
          )}
          <Typography variant="body2" color={user?.status ? "green" : "grey"}>
            {user?.status ? "Active" : "Inactive"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Logout Button */}
      <MenuItem
        onClick={handleLogout}
        sx={{
          justifyContent: "center",
          fontWeight: "bold",
          color: "#741B92",
          transition: "background 0.2s",
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
      >
        <ListItemIcon>
          <Logout sx={{ color: "#741B92" }} />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;

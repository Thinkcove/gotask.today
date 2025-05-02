import React from "react";
import { Box, Typography } from "@mui/material";
import { Person, Work, CheckCircle, Cancel } from "@mui/icons-material";
import { useUser } from "@/app/userContext";

const UserInfoCard: React.FC = ({}) => {
  const { user, logout } = useUser();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 3,
          p: 2,
          mb: 2,
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
          mx: 1
        }}
      >
        {/* Name */}
        <Box display="flex" alignItems="center" gap={1}>
          <Person sx={{ color: "#741B92", fontSize: 20 }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", textTransform: "capitalize", color: "#2A1237" }}
          >
            {user.name}
          </Typography>
        </Box>

        {/* Role */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          <Work sx={{ color: "#999", fontSize: 18 }} />
          <Typography variant="body2" color="text.secondary">
            {user?.roleId?.name}
          </Typography>
        </Box>

        {/* Status */}
        <Box display="flex" alignItems="center" gap={1} mt={1}>
          {user.status ? (
            <CheckCircle sx={{ color: "green", fontSize: 18 }} />
          ) : (
            <Cancel sx={{ color: "grey", fontSize: 18 }} />
          )}
          <Typography variant="body2" sx={{ color: user.status ? "green" : "grey" }}>
            {user.status ? "Active" : "Inactive"}
          </Typography>
        </Box>
      </Box>

      {/* Logout */}
      <Box sx={{ px: 1.5, pb: 2 }}>
        <Box
          component="button"
          onClick={handleLogout}
          sx={{
            width: "100%",
            backgroundColor: "#741B92",
            color: "#fff",
            border: "none",
            borderRadius: 2,
            padding: "8px 12px",
            fontWeight: "bold",
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "background 0.3s",
            "&:hover": {
              backgroundColor: "#5a1473"
            }
          }}
        >
          Logout
        </Box>
      </Box>
    </>
  );
};

export default UserInfoCard;

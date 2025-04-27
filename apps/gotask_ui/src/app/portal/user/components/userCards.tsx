import React from "react";
import { Typography, Grid, CircularProgress, Box, Stack, Divider, Chip } from "@mui/material";
import { Business, ArrowForward, Email } from "@mui/icons-material";
import CardComponent from "@/app/component/card/cardComponent";
import { User } from "../interfaces/userInterface";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import { useRouter } from "next/navigation";

interface UserCardProps {
  users: User[] | null;
  error: { [key: string]: string };
}

const UserCards: React.FC<UserCardProps> = ({ users, error }) => {
  const router = useRouter();

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="error">
          Error loading users
        </Typography>
      </Box>
    );
  }

  if (!users) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="text.secondary">
          No Users available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {users.map((user: User) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
            <CardComponent>
              <Stack spacing={3}>
                {/* Top Section: Avatar & Name */}
                {/* Top Section: Avatar, Name & Status */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AlphabetAvatar userName={user.name} size={48} fontSize={18} />
                    <Box>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {user.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {user.role?.name || "No Role Assigned"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    label={user.status ? "Active" : "Inactive"}
                    sx={{
                      backgroundColor: "#fff",
                      border: `1px solid ${user.status ? "#4CAF50" : "#9E9E9E"}`,
                      color: user.status ? "#4CAF50" : "#9E9E9E",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      borderRadius: 4,
                      px: 2,
                      py: 0.5
                    }}
                  />
                </Stack>

                <Divider />

                <Box>
                  {/* Email Info */}
                  <Box display="flex" alignItems="center" mb={0}>
                    <Email sx={{ fontSize: 20, color: "#741B92", mr: 1 }} />
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="text.secondary"
                      sx={{ m: 0 }}
                    >
                      {user.user_id}
                    </Typography>
                  </Box>

                  {/* Organization Info */}
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <Business sx={{ fontSize: 20, color: "#741B92", mr: 1 }} />
                    <Box>
                      {user.organizations && user.organizations.length > 0 ? (
                        user.organizations.map((org, index) => (
                          <Typography
                            key={org.id || index}
                            variant="body2"
                            fontWeight={500}
                            color="text.secondary"
                            sx={{ m: 0 }}
                          >
                            {org.name}
                          </Typography>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          color="text.secondary"
                          sx={{ m: 0 }}
                        >
                          No Organization for this user
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* View Details Button */}
                <Box display="flex" justifyContent="flex-end">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#741B92",
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline"
                      }
                    }}
                    onClick={() => {
                      router.push(`/portal/user/viewUser/${user.id}`);
                    }}
                  >
                    <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
                      View Details
                    </Typography>
                    <ArrowForward fontSize="small" />
                  </Box>
                </Box>
              </Stack>
            </CardComponent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserCards;

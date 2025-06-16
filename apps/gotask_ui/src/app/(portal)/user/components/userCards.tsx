import React from "react";
import { Typography, Grid, CircularProgress, Box, Stack, Divider, Chip } from "@mui/material";
import { Business, ArrowForward, Email } from "@mui/icons-material";
import CardComponent from "@/app/component/card/cardComponent";
import { User } from "../interfaces/userInterface";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import { useRouter } from "next/navigation";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";

interface UserCardProps {
  users: User[] | null;
}

const UserCards: React.FC<UserCardProps> = ({ users }) => {
  const { canAccess } = useUserPermission();
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const router = useRouter();

  if (!users) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return <EmptyState imageSrc={NoSearchResultsImage} message={transuser("nouser")} />;
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {users.map((user: User) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
            <CardComponent>
              <Stack spacing={3} sx={{ height: "100%" }}>
                {/* Header with Name and Status */}
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

                {/* Contact Info */}
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
                    <Box display="flex" alignItems="center" flexWrap="wrap">
                      {user.organizations && user.organizations.length > 0 ? (
                        <>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            color="text.secondary"
                            sx={{ m: 0 }}
                          >
                            {user.organizations[0].name}
                          </Typography>
                          {user.organizations.length > 1 && (
                            <Box
                              sx={{
                                ml: 1,
                                px: 1,
                                backgroundColor: "#F3E5F5",
                                color: "#741B92",
                                fontSize: 12,
                                fontWeight: 500,
                                borderRadius: "8px",
                                lineHeight: "20px"
                              }}
                            >
                              +{user.organizations.length - 1} more
                            </Box>
                          )}
                        </>
                      ) : (
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          color="text.secondary"
                          sx={{ m: 0 }}
                        >
                          {transuser("noorganzationuser")}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* View Details Button */}
                {canAccess(APPLICATIONS.USER, ACTIONS.VIEW) && (
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
                        router.push(`/user/viewUser/${user.id}`);
                      }}
                    >
                      <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
                        {transuser("viewdetails")}
                      </Typography>
                      <ArrowForward fontSize="small" />
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardComponent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserCards;

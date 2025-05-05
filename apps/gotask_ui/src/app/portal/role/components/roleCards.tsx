import { useRouter } from "next/navigation";
import { Role } from "../interfaces/roleInterface";
import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import CardComponent from "@/app/component/card/cardComponent";
import { ArrowForward, SupervisorAccount } from "@mui/icons-material"; // <-- New Icon
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { userPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";

interface RolesCardProps {
  roles: Role[] | null;
}

const RoleCards: React.FC<RolesCardProps> = ({ roles }) => {
  const { canAccess } = userPermission();
  const transrole = useTranslations(LOCALIZATION.TRANSITION.ROLE);
  const router = useRouter();

  if (!roles) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (roles.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="text.secondary">
          {transrole("noroleavailable")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {roles.map((role: Role) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={role.id}>
            <CardComponent>
              <Stack spacing={2} sx={{ height: "100%" }}>
                {/* Top Content */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <SupervisorAccount sx={{ fontSize: 40, color: "#741B92", mr: 1 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                      {role.name.trim()}
                    </Typography>
                  </Box>
                </Stack>
                {/* Access Details */}
                {role.accessDetails && role.accessDetails.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      ml: 1
                    }}
                  >
                    <Typography
                      key={role.accessDetails[0].id}
                      variant="body2"
                      fontWeight={500}
                      sx={{ color: "text.secondary", m: 0, textTransform: "capitalize" }}
                    >
                      • {role.accessDetails[0].name}
                    </Typography>

                    {role.accessDetails.length > 1 && (
                      <Box
                        sx={{
                          px: 1,
                          backgroundColor: "#F3E5F5",
                          color: "#741B92",
                          fontSize: 12,
                          fontWeight: 500,
                          borderRadius: "8px",
                          lineHeight: "20px"
                        }}
                      >
                        +{role.accessDetails.length - 1} more
                      </Box>
                    )}
                  </Box>
                )}

                {/* View Details at Bottom */}
                {canAccess(APPLICATIONS.ROLE, ACTIONS.VIEW) && (
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
                        router.push(`/portal/role/viewRoles/${role.id}`);
                      }}
                    >
                      <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
                        {transrole("viewdetail")}
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

export default RoleCards;

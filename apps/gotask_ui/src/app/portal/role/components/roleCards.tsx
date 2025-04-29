import { useRouter } from "next/navigation";
import { Role } from "../interfaces/roleInterface";
import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import CardComponent from "@/app/component/card/cardComponent";
import { AccountTree, ArrowForward, SupervisorAccount } from "@mui/icons-material"; // <-- New Icon

interface RolesCardProps {
  roles: Role[] | null;
}

const RoleCards: React.FC<RolesCardProps> = ({ roles }) => {
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
          No roles available.
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
              <Stack spacing={2}>
                {/* Icon and Role Name */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <SupervisorAccount sx={{ fontSize: 40, color: "#741B92", mr: 1 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                      {role.name.trim()}
                    </Typography>
                  </Box>
                </Stack>

                {/* Only Access Names */}
                {role.accessDetails && role.accessDetails.length > 0 && (
                  <Stack spacing={0.5}>
                    {role.accessDetails.map((accessDetail) => (
                      <Typography
                        key={accessDetail.id}
                        variant="body2"
                        fontWeight={500}
                        sx={{ color: "text.secondary", ml: 1 }}
                      >
                        • {accessDetail.name}
                      </Typography>
                    ))}
                  </Stack>
                )}

                {/* View Details Action */}
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

export default RoleCards;

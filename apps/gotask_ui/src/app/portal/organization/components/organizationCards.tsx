import React from "react";
import { Typography, Grid, CircularProgress, Box, Stack } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PlaceIcon from "@mui/icons-material/Place";
import { Organization } from "../interfaces/organizatioinInterface";
import CardComponent from "@/app/component/card/cardComponent";
import { ArrowForward, Business } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface OrganizationCardProps {
  organizations: Organization[] | null;
}

const OrganizationCards: React.FC<OrganizationCardProps> = ({ organizations }) => {
  const transorganization = useTranslations(LOCALIZATION.TRANSITION.ORGANIZATION);
  const router = useRouter();
  if (!organizations) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (organizations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="text.secondary">
          {transorganization("noOrganizations")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        {organizations.map((organization: Organization) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={organization.id}>
            <CardComponent>
              <Stack spacing={2}>
                {/* Avatar and Name */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Business sx={{ fontSize: 40, color: "#741B92", mr: 1 }} />

                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                      {organization.name.trim()}
                    </Typography>
                  </Box>
                </Stack>

                {/* Details */}
                <Stack spacing={1.5} mt={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PlaceIcon fontSize="small" sx={{ color: "#741B92" }} />
                    <Typography variant="body2" color="text.secondary">
                      {organization.address}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon fontSize="small" sx={{ color: "#741B92" }} />
                    <Typography variant="body2" color="text.secondary">
                      {organization.mail_id}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Action */}
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
                      router.push(`/portal/organization/viewOrganization/${organization.id}`);
                    }}
                  >
                    <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
                      {transorganization("viewDetails")}
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

export default OrganizationCards;

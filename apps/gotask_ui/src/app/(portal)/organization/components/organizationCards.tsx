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
import EllipsisText from "@/app/component/text/ellipsisText";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";

interface OrganizationCardProps {
  organizations: Organization[] | null;
}

const OrganizationCards: React.FC<OrganizationCardProps> = ({ organizations }) => {
  const { canAccess, isFieldRestricted } = useUserPermission();
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
      <EmptyState
        imageSrc={NoSearchResultsImage}
        message={transorganization("noorganizations")}
      />
    );
  }

  return (
    <Box>
      <Grid container spacing={4}>
        {organizations.map((organization: Organization) => {
          // Filter fields based on field-level permission
          const filteredOrg = {} as Partial<Organization>;
          for (const key of Object.keys(organization) as (keyof Organization)[]) {
            if (!isFieldRestricted(APPLICATIONS.ORGANIZATION, ACTIONS.READ, key)) {
              (filteredOrg as any)[key] = organization[key];
            }
          }

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={organization.id}>
              <CardComponent>
                <Stack spacing={2}>
                  {/* Avatar and Name */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Business sx={{ fontSize: 40, color: "#741B92", mr: 1 }} />
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                        {filteredOrg.name?.trim()}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Details */}
                  <Stack spacing={1.5} mt={1}>
                    {!isFieldRestricted(APPLICATIONS.ORGANIZATION, ACTIONS.READ, "address") && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PlaceIcon fontSize="small" sx={{ color: "#741B92" }} />
                        <EllipsisText text={filteredOrg.address ?? ""} maxWidth={350} />
                      </Stack>
                    )}
                    {!isFieldRestricted(APPLICATIONS.ORGANIZATION, ACTIONS.READ, "mail_id") && (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon fontSize="small" sx={{ color: "#741B92" }} />
                        <Typography variant="body2" color="text.secondary">
                          {filteredOrg.mail_id}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>

                  {/* View Details */}
                  {canAccess(APPLICATIONS.ORGANIZATION, ACTIONS.VIEW) && (
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
                          router.push(`/organization/viewOrganization/${organization.id}`);
                        }}
                      >
                        <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
                          {transorganization("viewdetails")}
                        </Typography>
                        <ArrowForward fontSize="small" />
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardComponent>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default OrganizationCards;

import { useParams, useRouter } from "next/navigation";
import { Organization } from "../../interfaces/organizatioinInterface";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { Box, Divider, Grid, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material";
import { ArrowBack, ChevronRight, Edit } from "@mui/icons-material";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import { useState } from "react";
import { getStatusColor } from "@/app/common/constants/task";
import EditOrganization from "./editOrganization";
import { KeyedMutator } from "swr";
import EllipsisText from "@/app/component/text/ellipsisText";
import LabelValueText from "@/app/component/text/labelValueText";

interface OrgDetailProps {
  org: Organization;
  mutate: KeyedMutator<Organization>;
}

const OrgDetail: React.FC<OrgDetailProps> = ({ org, mutate }) => {
  const router = useRouter();
  const { orgId } = useParams();
  const orgID = orgId as string;
  const [editOpen, setEditOpen] = useState(false);

  const handleBack = () => {
    setTimeout(() => router.back(), 2000);
  };
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <ModuleHeader name="Organization Detail View" />
      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        {/* Main Card */}
        <Box
          sx={{
            borderRadius: 4,
            p: 4,
            bgcolor: "#f9fafb",
            border: "1px solid #e0e0e0"
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Typography variant="h4" fontWeight={700}>
                {org.name}
              </Typography>

              <IconButton edge="start" color="primary" onClick={() => setEditOpen(true)}>
                <Edit />
              </IconButton>
            </Box>
          </Box>

          {/* Basic Details */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <LabelValueText label="Address" value={org.address} />
            </Grid>
            <Grid item xs={12} md={6}>
              <LabelValueText label="Email ID" value={org.mail_id} />
            </Grid>
            <Grid item xs={12} md={6}>
              <LabelValueText
                label="Created on:"
                value={new Date(org?.createdAt).toLocaleDateString()}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 1 }} />

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 4, width: "100%" }}
          >
            <Tab label="Resources" />
            <Tab label="Projects List" />
          </Tabs>

          {/* Users Tab */}
          {activeTab === 0 && (
            <Grid container spacing={3} sx={{ maxHeight: "300px", overflowY: "auto" }}>
              {org?.userDetails?.length > 0 ? (
                org.userDetails.map((user) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "#ffffff",
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          cursor: "pointer"
                        }
                      }}
                      onClick={() => {
                        router.push(`/portal/user/viewUser/${user.id}`);
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <AlphabetAvatar userName={user.name} size={44} fontSize={16} />
                        <Box>
                          <Typography fontWeight={600} fontSize="1rem">
                            {user.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.user_id}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Chevron Icon */}
                      <ChevronRight color="action" />
                    </Box>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography color="text.secondary">No users yet.</Typography>
                </Grid>
              )}
            </Grid>
          )}

          {/* Projects Tab */}
          {activeTab === 1 && (
            <Grid container spacing={3} sx={{ maxHeight: "300px", overflowY: "auto" }}>
              {org.projectDetails.length > 0 ? (
                org.projectDetails.map((project) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "#ffffff",
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          cursor: "pointer"
                        }
                      }}
                      onClick={() => {
                        router.push(`/portal/project/viewProject/${project.id}`);
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box>
                          <Typography fontWeight={600} fontSize="1rem">
                            {project.name}
                          </Typography>
                          <EllipsisText text={project.description} maxWidth={350} />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              pt: 0.5
                            }}
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                backgroundColor: getStatusColor(project.status),
                                mr: 1.5
                              }}
                            />
                            <Typography
                              sx={{
                                color: getStatusColor(project.status),
                                textTransform: "capitalize"
                              }}
                            >
                              {project.status}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                      {/* Chevron Icon */}
                      <ChevronRight color="action" />
                    </Box>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography color="text.secondary">No projects yet.</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Box>

        <EditOrganization
          open={editOpen}
          onClose={() => setEditOpen(false)}
          data={org}
          mutate={mutate}
          OrganizationID={orgID}
        />
      </Box>
    </>
  );
};

export default OrgDetail;

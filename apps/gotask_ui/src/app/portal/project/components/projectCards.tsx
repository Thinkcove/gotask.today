import React, { useState } from "react";
import { Typography, Grid, CircularProgress, Box } from "@mui/material";
import { ArrowForward, Group } from "@mui/icons-material";
import { getStatusColor } from "@/app/common/constants/task";
import { useRouter } from "next/navigation";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import CardComponent from "@/app/component/card/cardComponent";
import { Project } from "../interfaces/projectInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import EllipsisText from "@/app/component/text/ellipsisText";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import SearchBar from "@/app/component/searchBar/searchBar";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";

interface ProjectCardProps {
  projects: Project[] | null;
  error: { [key: string]: string };
}

const ProjectCards: React.FC<ProjectCardProps> = ({ projects, error }) => {
  const { canAccess } = useUserPermission();
  const router = useRouter();
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects =
    projects?.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    [];

  // Error state
  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="error">
          {transproject("errorloading")} {error.message || "Unknown error"}
        </Typography>
      </Box>
    );
  }

  // Handle loading state
  if (!projects) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box mb={3} maxWidth={400}>
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          sx={{ width: "100%" }}
          placeholder="Search Project"
        />
      </Box>

      {filteredProjects.length === 0 ? (
        <Grid item xs={12}>
          <EmptyState imageSrc={NoSearchResultsImage} message={transproject("noprojects")} />
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} sm={6} md={3} key={project.id}>
              <CardComponent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Typography variant="h6" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                    {project.name}
                  </Typography>
                  <StatusIndicator status={project.status} getColor={getStatusColor} />
                </Box>

                {/* Project Description */}
                <Box sx={{ mb: 2, pt: 1 }}>
                  <EllipsisText text={project.description} maxWidth={350} />
                </Box>

                {/* Users Info */}
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <Group sx={{ fontSize: 20, color: "#741B92", mr: 1 }} />

                  {/* Render Avatars for users */}
                  <Box display="flex" alignItems="center">
                    {project.users?.length > 0 ? (
                      project.users
                        .slice(0, 3)
                        .map((user, index) => <AlphabetAvatar userName={user.name} key={index} />)
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {transproject("nouser")}
                      </Typography>
                    )}

                    {/* If there are more than 3 users, display the count */}
                    {project.users?.length > 3 && (
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
                        +{project.users.length - 3} more
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* View Details Button */}
                {canAccess(APPLICATIONS.PROJECT, ACTIONS.VIEW) && (
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
                        router.push(`/portal/project/viewProject/${project.id}`);
                      }}
                    >
                      <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
                        {transproject("viewdetails")}
                      </Typography>
                      <ArrowForward fontSize="small" />
                    </Box>
                  </Box>
                )}
              </CardComponent>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProjectCards;

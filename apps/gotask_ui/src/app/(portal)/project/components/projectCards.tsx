import React from "react";
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
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";

interface ProjectCardProps {
  projects: Project[] | null;
}

const ProjectCards: React.FC<ProjectCardProps> = ({ projects }) => {
  const { canAccess, isFieldRestricted } = useUserPermission();
  const router = useRouter();
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  if (!projects) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (projects.length === 0) {
    return <EmptyState imageSrc={NoSearchResultsImage} message={transproject("noprojects")} />;
  }
  return (
    <Box>
      <Grid container spacing={3}>
        {projects.map((project) => {
          // Filter out restricted fields at the top
          const filteredProject = {} as Partial<Project>;

          for (const key of Object.keys(project) as (keyof Project)[]) {
            if (!isFieldRestricted(APPLICATIONS.PROJECT, ACTIONS.READ, key)) {
              if (key === "users") {
                filteredProject.users = project.users;
              } else {
                filteredProject[key] = project[key] as string;
              }
            }
          }

          return (
            <Grid item xs={12} sm={6} md={3} key={project.id}>
              <CardComponent>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Typography variant="h6" fontWeight={600} sx={{ textTransform: "capitalize" }}>
                    {filteredProject.name}
                  </Typography>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 2, pt: 1 }}>
                  <EllipsisText text={filteredProject.description!} maxWidth={350} />
                </Box>

                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <Group sx={{ fontSize: 20, color: "#741B92", mr: 1 }} />
                  <Box display="flex" alignItems="center">
                    {filteredProject.users?.length ? (
                      filteredProject.users
                        .slice(0, 3)
                        .map((user, index) => <AlphabetAvatar userName={user.name} key={index} />)
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {transproject("nouser")}
                      </Typography>
                    )}
                    {filteredProject.users && filteredProject.users.length > 3 && (
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
                        +{filteredProject.users.length - 3} more
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* View Details */}
                {canAccess(APPLICATIONS.PROJECT, ACTIONS.VIEW) && (
                  <Box display="flex" justifyContent="space-between">
                    <StatusIndicator status={project.status} getColor={getStatusColor} />
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
                        router.push(`/project/viewProject/${project.id}`);
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
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProjectCards;

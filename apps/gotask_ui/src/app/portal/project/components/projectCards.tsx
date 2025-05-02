import React from "react";
import { Typography, Grid, CircularProgress, Box } from "@mui/material";
import { ArrowForward, Group } from "@mui/icons-material";
import { getStatusColor } from "@/app/common/constants/task";
import { useRouter } from "next/navigation";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import CardComponent from "@/app/component/card/cardComponent";
import { Project } from "../interfaces/projectInterface";
import EllipsisText from "@/app/component/text/ellipsisText";
import StatusIndicator from "@/app/component/status/statusIndicator";

interface ProjectCardProps {
  projects: Project[] | null; // Ensure projects is an array or null
  error: { [key: string]: string };
}

const ProjectCards: React.FC<ProjectCardProps> = ({ projects, error }) => {
  const router = useRouter();

  // Handle error
  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="error">
          Error loading projects: {error.message || "Unknown error"}
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

  // Handle empty projects array
  if (projects.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="text.secondary">
          No projects available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {projects.map((project: Project) => (
          <Grid item xs={12} sm={6} md={3} key={project.id}>
            <CardComponent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" fontWeight={600}>
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
                      No users assigned
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
                    View Details
                  </Typography>
                  <ArrowForward fontSize="small" />
                </Box>
              </Box>
            </CardComponent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectCards;

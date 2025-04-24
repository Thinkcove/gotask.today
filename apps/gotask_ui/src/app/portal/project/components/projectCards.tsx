import React from "react";
import { Typography, Grid, Chip, CircularProgress, Box, Avatar, Button } from "@mui/material";
import useSWR from "swr";
import { fetchProjects } from "../services/projectAction";
import { Group } from "@mui/icons-material";
import { getStatusColor } from "@/app/common/constants/task";
import { getColorForUser } from "@/app/common/constants/avatar";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user_id: string[]; // Assume each user_id corresponds to a user
};

const fetcher = async () => {
  const data = await fetchProjects();
  return data;
};

const ProjectCards: React.FC = () => {
  const { data: projects, error } = useSWR("fetch-projects", fetcher);

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="error">
          Error loading projects
        </Typography>
      </Box>
    );
  }

  if (!projects) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }
  const router = useRouter();

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {projects.map((project: Project) => (
          <Grid item xs={12} sm={6} md={3} key={project.id}>
            <Box
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                background: "linear-gradient(145deg, #ffffff, #f7f3fa)",
                border: "1px solid #eee",
                p: 4,
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
                "&:hover": {
                  boxShadow: "0 4px 4px rgba(0, 0, 0, 0.2)"
                }
              }}
            >
              {/* Title */}
              <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "#741B92" }}>
                {project.name}
              </Typography>

              {/* Description */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {project.description}
              </Typography>

              {/* Status Chip */}
              <Chip
                label={project.status}
                sx={{
                  backgroundColor: "#fff",
                  border: `1px solid ${getStatusColor(project.status)}`,
                  color: getStatusColor(project.status),
                  fontWeight: "bold",
                  textTransform: "capitalize",
                  borderRadius: 4,
                  px: 2,
                  py: 0.5,
                  mb: 2
                }}
              />

              {/* Users Info */}
              <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Group sx={{ fontSize: 20, color: "#741B92", mr: 1 }} />
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                  Users:
                </Typography>

                {/* Render Avatars for users */}
                <Box display="flex" alignItems="center">
                  {project.user_id.slice(0, 3).map((userId, index) => (
                    <Avatar
                      key={index}
                      sx={{
                        width: 30,
                        height: 30,
                        mr: 0.75,
                        backgroundColor: getColorForUser(userId),
                        fontSize: "0.75rem"
                      }}
                    >
                      {userId.charAt(0).toUpperCase()}
                    </Avatar>
                  ))}

                  {/* If there are more than 3 users, display the count */}
                  {project.user_id.length > 3 && (
                    <Typography variant="caption" color="text.secondary">
                      +{project.user_id.length - 3}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Button or Action */}
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid #741B92",
                    color: "#741B92",
                    textTransform: "capitalize",
                    borderRadius: 2,
                    padding: "4px 8px"
                  }}
                  onClick={() => {
                    if (!project.id) {
                      console.warn("Project ID is missing", project);
                      return;
                    }
                    router.push(`/portal/project/viewProject/${project.id}`);
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectCards;

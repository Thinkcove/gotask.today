import React from "react";
import { Box, Typography, Card, IconButton, Button, Divider } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Organization } from "../../interfaces/organizatioinInterface";

interface ProjectDetailProps {
  project: Organization;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const router = useRouter();

  const handleBack = () => {
    setTimeout(() => router.back(), 2000);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#741B92", // Solid color for a bold look
          color: "white",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
            textTransform: "capitalize"
          }}
        >
          Project Detail View
        </Typography>
      </Box>
      <Box
        sx={{
          minHeight: "100vh",
          px: 4,
          py: 6,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        {/* Project and Users Info */}
        <Card
          elevation={3}
          sx={{
            borderRadius: 4,
            p: 4,
            backgroundColor: "#fff",
            border: "1px solid #e0e0e0"
          }}
        >
          {/* Project Info */}
          <Box display="flex" alignItems="center" mb={1}>
            <IconButton edge="start" color="primary" sx={{ mr: 1 }} onClick={handleBack}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight={700}>
              {project.name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Created on: {new Date(project.createdAt).toLocaleDateString()}
          </Typography>
          <Divider sx={{ my: 3 }} /> {/* Divider between Project Info and Users */}
          {/* Users Section */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={600}>
              Assignees
            </Typography>
            <Button variant="contained">+ Add</Button>
          </Box>
        </Card>
      </Box>
    </>
  );
};

export default ProjectDetail;

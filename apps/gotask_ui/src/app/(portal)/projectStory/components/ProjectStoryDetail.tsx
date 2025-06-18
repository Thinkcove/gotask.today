// /app/(portal)/project/[projectId]/stories/[storyId]/ProjectStoryDetail.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { getProjectStoryById } from "@/app/(portal)/projectStory/services/projectStoryService";
import { ProjectStory } from "@/app/(portal)/projectStory/interfaces/projectStory";

const ProjectStoryDetail = () => {
  const { storyId, projectId } = useParams();
  const router = useRouter();
  const [story, setStory] = useState<ProjectStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storyId) return;

    const fetchStory = async () => {
      try {
        const response = await getProjectStoryById(storyId as string);
        setStory(response?.data);
      } catch (error) {
        console.error("Error fetching story:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!story) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>Story not found.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Button variant="outlined" onClick={() => router.push(`/project/viewProject/${projectId}/stories`)}>
        Back to Stories
      </Button>

      <Typography variant="h4" mt={2}>{story.title}</Typography>
      <Typography variant="body1" mt={1}>{story.description}</Typography>
      <Typography variant="caption" color="primary" mt={2} display="block">
        Status: {story.status || "N/A"}
      </Typography>
    </Box>
  );
};

export default ProjectStoryDetail;

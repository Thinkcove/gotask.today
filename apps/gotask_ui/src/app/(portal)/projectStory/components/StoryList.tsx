"use client";

import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, CircularProgress, Button } from "@mui/material";
import { getStoriesByProject } from "../services/projectStoryService";
import { ProjectStory } from "../interfaces/projectStory";
import StoryCard from "./StoryCard";
import { useParams, useRouter } from "next/navigation";

const StoryList = () => {
  const { projectId } = useParams();
  const router = useRouter();
  const [stories, setStories] = useState<ProjectStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchStories = async () => {
      try {
        const response = await getStoriesByProject(projectId as string);
        setStories(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch stories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [projectId]);

  return (
    <Box>
      {/* 🔹 Create Story Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push(`/project/${projectId}/stories/create`)}
        >
          Create Story
        </Button>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : stories.length === 0 ? (
        <Typography textAlign="center">No stories found for this project.</Typography>
      ) : (
        <Grid container spacing={3}>
          {stories.map((story) => (
            <Grid item xs={12} sm={6} md={4} key={story.id}>
              <StoryCard story={story} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StoryList;

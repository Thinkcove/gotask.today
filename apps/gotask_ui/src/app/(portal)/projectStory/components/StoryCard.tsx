"use client";

import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { ProjectStory } from "../interfaces/projectStory";
import { useRouter, useParams } from "next/navigation";

interface StoryCardProps {
  story: ProjectStory;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const router = useRouter();
  const { projectId } = useParams();

  const handleClick = () => {
    router.push(`/project/viewProject/${projectId}/stories/${story.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        borderRadius: 2,
        height: "100%",
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 4
        }
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={600}>
          {story.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {story.description || "No description provided."}
        </Typography>
        <Typography variant="caption" color="primary" display="block" mt={2}>
          Status: {story.status || "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StoryCard;

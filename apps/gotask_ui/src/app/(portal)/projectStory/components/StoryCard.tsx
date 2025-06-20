"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { ArrowForward } from "@mui/icons-material";
import { ProjectStory } from "../interfaces/projectStory";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";

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
      sx={{
        borderRadius: 3,
        height: 180,          // Fixed height
        width: "100%",        // Responsive to Grid column
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "default",
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 2
        }}
      >
        {/* Title + Description */}
        <Box>
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ textTransform: "capitalize" }}
            gutterBottom
          >
            {story.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              mb: 1
            }}
          >
            {story.description || "-"}
          </Typography>

          {/* Status & Created At in one row */}
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Status: <strong>{story.status || "N/A"}</strong>
            </Typography>
            {story.createdAt && (
              <Typography variant="caption" color="text.secondary">
                Created: <FormattedDateTime date={story.createdAt} />
              </Typography>
            )}
          </Stack>
        </Box>

        {/* View Details (always at bottom) */}
        <Box
          mt={2}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          onClick={handleClick}
          sx={{
            color: "#741B92",
            fontWeight: 500,
            cursor: "pointer",
            ":hover": { textDecoration: "underline" }
          }}
        >
          <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
            View Details
          </Typography>
          <ArrowForward fontSize="small" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StoryCard;

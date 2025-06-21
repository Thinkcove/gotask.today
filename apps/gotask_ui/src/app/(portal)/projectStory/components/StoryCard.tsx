"use client";

import React from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { ArrowForward } from "@mui/icons-material";
import { ProjectStory } from "../interfaces/projectStory";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { STORY_STATUS_COLOR, StoryStatus } from "@/app/common/constants/storyStatus";

interface StoryCardProps {
  story: ProjectStory;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const router = useRouter();
  const { projectId } = useParams();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const status = (story.status as StoryStatus) || "to-do";
  const color = STORY_STATUS_COLOR[status] || "#ccc";
  const bg = `${color}22`;
  const border = `${color}88`;

  const handleClick = () => {
    router.push(`/project/viewProject/${projectId}/stories/${story.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: 3,
        height: 180,
        width: "100%",
        boxShadow: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "background-color 0.3s, border-color 0.3s",
        "&:hover": { boxShadow: 4 }
      }}
    >
      <CardContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%"
        }}
      >
        {/* Top: Title & Description */}
        <Box sx={{ flex: 1 }}>
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
            {story.description || t("Stories.noDescriptionShort")}
          </Typography>

          {/* Status Badge and CreatedAt */}
          <Stack direction="row" spacing={2} alignItems="center" mt={1}>
            <StatusIndicator
              status={status}
              getColor={(s) => STORY_STATUS_COLOR[s as StoryStatus]}
            />
          </Stack>
        </Box>

        {/* Bottom: View Details */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          <Typography
            sx={{
              textTransform: "capitalize",
              mr: 0.5,
              color: "#741B92",
              fontWeight: 500,
              ":hover": { textDecoration: "underline" }
            }}
          >
            {t("Stories.viewdetails")}
          </Typography>
          <ArrowForward fontSize="small" sx={{ color: "#741B92" }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StoryCard;

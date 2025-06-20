"use client";

import React from "react";
import useSWR from "swr";
import { Box, Typography, CircularProgress, Grid, IconButton, Fab, Tooltip } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { ArrowBack, Add as AddIcon } from "@mui/icons-material";
import { getStoriesByProject } from "../services/projectStoryService";
import { ProjectStory } from "../interfaces/projectStory";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import StoryCard from "../components/StoryCard";

const fetcher = (projectId: string) => getStoriesByProject(projectId).then((res) => res?.data);

const StoryList: React.FC = () => {
  const { projectId } = useParams();
  const router = useRouter();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const {
    data: stories = [],
    isLoading,
    error
  } = useSWR(projectId ? `stories-${projectId}` : null, () => fetcher(projectId as string));

  const projectName = stories[0]?.project?.name ?? "";

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="body1" color="error">
          {t("Stories.fetchError")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", p: 2, width: "100%" }}>
      {/* Header with Back Icon and Title */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap"
        }}
      >
        <IconButton
          onClick={() => router.push(`/project/viewProject/${projectId}`)}
          color="primary"
          size="small"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" fontWeight={600}>
          {t("Stories.titleWithProject", { name: projectName })}
        </Typography>
      </Box>

      {/* Stories Grid  */}
      <Box sx={{ px: 2, pt: 10 }}>
        {stories.length === 0 ? (
          <EmptyState imageSrc={NoSearchResultsImage} message={t("Stories.noStoriesFound")} />
        ) : (
          <Grid container spacing={2}>
            {stories.map((story: ProjectStory) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={story.id}>
                <StoryCard story={story} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Floating Create Button  */}
      <Tooltip title={t("Stories.createStory")}>
        <Fab
          color="primary"
          onClick={() => router.push(`/project/viewProject/${projectId}/stories/create`)}
          sx={{
            position: "fixed",
            bottom: 35,
            right: 35,
            zIndex: 1000
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default StoryList;

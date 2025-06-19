"use client";

import React from "react";
import useSWR from "swr";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  IconButton,
  Fab,
  Tooltip
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { getStoriesByProject } from "../services/projectStoryService";
import { ProjectStory } from "../interfaces/projectStory";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";
import { useTranslations } from "next-intl";

const fetcher = (projectId: string) =>
  getStoriesByProject(projectId).then((res) => res?.data);

const StoryList: React.FC = () => {
  const { projectId } = useParams();
  const router = useRouter();
  const t = useTranslations("Projects.Stories");

  const { data: stories = [], isLoading, error } = useSWR(
    projectId ? `stories-${projectId}` : null,
    () => fetcher(projectId as string)
  );

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
          {t("fetchError")}
        </Typography>
      </Box>
    );
  }

  if (stories.length === 0) {
    return (
      <EmptyState
        imageSrc={NoSearchResultsImage}
        message={t("noStoriesFound")}
      />
    );
  }

  return (
    <Box sx={{ position: "relative", p: 2, width: "100%" }}>
      {/* Back Button */}
      <IconButton
        onClick={() => router.push(`/project/viewProject/${projectId}`)}
        sx={{ position: "absolute", top: 16, left: 16 }}
        color="primary"
      >
        <ArrowBack />
      </IconButton>

      {/* Stories Grid */}
      <Box sx={{ px: 2,pt: 10}}>
        <Grid container spacing={2}>
          {stories.map((story: ProjectStory) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={story.id}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  height: "100%",
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ textTransform: "capitalize", mb: 1 }}
                  >
                    {story.title}
                  </Typography>

                  {/* Truncated Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {story.description || "-"}
                  </Typography>

                  {/* Created Date */}
                  {story.createdAt && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mt={1}
                    >
                      {t("createdat")}:{" "}
                      <FormattedDateTime date={story.createdAt} />
                    </Typography>
                  )}
                </Box>

                {/* View Details Link */}
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#741B92",
                      fontWeight: 500,
                      cursor: "pointer",
                      ":hover": { textDecoration: "underline" }
                    }}
                    onClick={() =>
                      router.push(
                        `/project/viewProject/${projectId}/stories/${story.id}`
                      )
                    }
                  >
                    <Typography sx={{ textTransform: "capitalize", mr: 0.5 }}>
                      {t("viewdetails")}
                    </Typography>
                    <ArrowForward fontSize="small" />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Floating Create Button */}
      <Tooltip title={t("createStory")}>
        <Fab
          color="primary"
          onClick={() =>
            router.push(`/project/viewProject/${projectId}/stories/create`)
          }
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

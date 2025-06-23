"use client";

import React, { useState } from "react";
import useSWR from "swr";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  IconButton,
  Fab,
  Tooltip,
  Pagination
} from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowBack, Add as AddIcon } from "@mui/icons-material";

import { getStoriesByProject } from "../services/projectStoryService";
import { ProjectStory } from "../interfaces/projectStory";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import StoryCard from "../components/StoryCard";
import StoryFilters from "../components/StoryFilters";

interface StoryListProps {
  onProjectNameFetch?: (name: string) => void;
}

const StoryList: React.FC<StoryListProps> = ({ onProjectNameFetch }) => {
  const { projectId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const initialStatus = searchParams.getAll("status");
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialStartDate = searchParams.get("startDate") || "";

  const [status, setStatus] = useState<string[]>(initialStatus);
  const [page, setPage] = useState<number>(initialPage);
  const [startDate, setStartDate] = useState<string>(initialStartDate);

  const limit = 8;

  const fetcher = async () => {
    return await getStoriesByProject(projectId as string, {
      status,
      page,
      limit,
      startDate
    });
  };

  const swrKey = `stories-${projectId}-${status.join(",") || "all"}-${page}-${startDate || "all"}`;
  const { data, isLoading, error } = useSWR(swrKey, fetcher);

  const stories: ProjectStory[] = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const projectName = stories[0]?.project?.name ?? "";

  // Trigger project name callback
  if (projectName && onProjectNameFetch) {
    onProjectNameFetch(projectName);
  }

  const updateQueryParams = (
    newStatus: string[],
    newPage: number = 1,
    newStartDate = startDate
  ) => {
    const params = new URLSearchParams();

    if (newStatus.length > 0) {
      newStatus.forEach((s) => params.append("status", s));
    }
    if (newStartDate) params.set("startDate", newStartDate);

    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      {/* Header */}
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
        {projectName && (
          <Typography variant="h6" fontWeight={600}>
            {t("Stories.titleWithProject", { name: projectName })}
          </Typography>
        )}
      </Box>

      {/* Filters */}
      <StoryFilters
        status={status}
        startDate={startDate}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
          updateQueryParams(val, 1);
        }}
        onStartDateChange={(newDate) => {
          setStartDate(newDate);
          setPage(1);
          updateQueryParams(status, 1, newDate);
        }}
        onClearFilters={() => {
          setStatus([]);
          setStartDate("");
          setPage(1);
          router.replace("?", { scroll: false });
        }}
      />

      {/* Story List */}
      <Box sx={{ px: 2, pt: 2 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center">
            {t("Stories.fetchError")}
          </Typography>
        ) : stories.length === 0 ? (
          <EmptyState imageSrc={NoSearchResultsImage} message={t("Stories.noStoriesFound")} />
        ) : (
          <>
            <Grid container spacing={2}>
              {stories.map((story: ProjectStory) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={story.id}>
                  <StoryCard story={story} />
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => {
                    setPage(value);
                    updateQueryParams(status, value);
                  }}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Add Story */}
      <Tooltip title={t("Stories.createStory")}>
        <Fab
          color="primary"
          onClick={() => router.push(`/project/viewProject/${projectId}/stories/create`)}
          sx={{ position: "fixed", bottom: 35, right: 35, zIndex: 1000 }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default StoryList;

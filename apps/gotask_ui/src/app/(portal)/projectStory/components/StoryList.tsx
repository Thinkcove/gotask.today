"use client";

import React, { useCallback, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { Box, Typography, CircularProgress, Grid, IconButton, Fab } from "@mui/material";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowBack, Add as AddIcon } from "@mui/icons-material";

import { getStoriesByProject } from "../services/projectStoryActions";
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

const limit = 12;

const StoryList: React.FC<StoryListProps> = ({ onProjectNameFetch }) => {
  const { projectId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const initialStatus = searchParams.getAll("status");
  const initialStartDate = searchParams.get("startDate") || "";

  const [status, setStatus] = useState<string[]>(initialStatus);
  const [startDate, setStartDate] = useState<string>(initialStartDate);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.data.length) return null;
    return `stories-${projectId}-${status.join(",")}-${startDate}-page-${pageIndex + 1}`;
  };

  const fetcher = async (_key: string) => {
    const page = Number(_key.split("page-").pop()) || 1;
    return await getStoriesByProject(projectId as string, {
      status,
      startDate,
      page,
      limit
    });
  };

  const { data, size, setSize, isLoading, isValidating, error } = useSWRInfinite(getKey, fetcher);

  const allStories: ProjectStory[] = data?.flatMap((page) => page.data) || [];
  const totalCount = data?.[0]?.pagination?.totalCount || 0;
  const hasMore = allStories.length < totalCount;

  const projectName = allStories[0]?.project?.name ?? "";
  if (projectName && onProjectNameFetch) {
    onProjectNameFetch(projectName);
  }

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastStoryRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || isLoading || isValidating || !hasMore) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSize((prev) => prev + 1);
        }
      });

      observerRef.current.observe(node);
    },
    [isLoading, isValidating, hasMore]
  );

  const updateQueryParams = (newStatus: string[], newStartDate = "") => {
    const params = new URLSearchParams();
    if (newStatus.length > 0) newStatus.forEach((s) => params.append("status", s));
    if (newStartDate) params.set("startDate", newStartDate);
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
          setSize(1);
          updateQueryParams(val, startDate);
        }}
        onStartDateChange={(val) => {
          setStartDate(val);
          setSize(1);
          updateQueryParams(status, val);
        }}
        onClearFilters={() => {
          setStatus([]);
          setStartDate("");
          setSize(1);
          router.replace("?", { scroll: false });
        }}
      />

      {/* Story List */}
      <Box sx={{ px: 2, pt: 2 }}>
        {isLoading && size === 1 ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center">
            {t("Stories.fetchError")}
          </Typography>
        ) : allStories.length === 0 ? (
          <EmptyState imageSrc={NoSearchResultsImage} message={t("Stories.noStoriesFound")} />
        ) : (
          <Grid container spacing={2}>
            {allStories.map((story, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={story.id}
                ref={index === allStories.length - 1 ? lastStoryRef : null}
              >
                <StoryCard story={story} />
              </Grid>
            ))}
          </Grid>
        )}
        {isValidating && hasMore && (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        )}
      </Box>

      {/* Add Story */}
      <Fab
        color="primary"
        onClick={() => router.push(`/project/viewProject/${projectId}/stories/create`)}
        sx={{ position: "fixed", bottom: 35, right: 35, zIndex: 1000 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default StoryList;

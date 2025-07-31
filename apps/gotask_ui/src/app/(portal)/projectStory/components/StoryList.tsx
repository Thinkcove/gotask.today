"use client";

import React, { useCallback, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { Box, Typography, CircularProgress, Grid, Fab, IconButton } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { Add as AddIcon, ArrowBack } from "@mui/icons-material";
import { getStoriesByProject } from "../services/projectStoryActions";
import { ProjectStory, PaginatedStoryResponse } from "../interfaces/projectStory";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import StoryCard from "../components/StoryCard";
import StoryFilters from "../components/StoryFilters";
import { getStoredObj, removeStorage, setStorage } from "@/app/common/utils/storage";
import { DEFAULT_STORY_PAGE_SIZE } from "@/app/common/constants/project";

const limit = DEFAULT_STORY_PAGE_SIZE;

interface StoryListProps {
  onProjectNameLoad?: (name: string) => void;
}

const StoryList: React.FC<StoryListProps> = ({ onProjectNameLoad }) => {
  const { projectId } = useParams();
  const router = useRouter();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const savedFilters = getStoredObj("storyListFilters") || {};
  const [status, setStatus] = useState<string[]>(savedFilters.status || []);
  const [startDate, setStartDate] = useState<string>(savedFilters.startDate || "");
  const [searchTerm, setSearchTerm] = useState<string>(savedFilters.searchTerm || "");

  const saveFilters = (filters: { status?: string[]; startDate?: string; searchTerm?: string }) => {
    setStorage("storyListFilters", {
      status: filters.status ?? status,
      startDate: filters.startDate ?? startDate,
      searchTerm: filters.searchTerm ?? searchTerm
    });
  };

  const handleStatusChange = (val: string[]) => {
    setStatus(val);
    saveFilters({ status: val });
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    saveFilters({ startDate: val });
  };

  const handleSearchTermChange = (val: string) => {
    setSearchTerm(val);
    saveFilters({ searchTerm: val });
  };

  const clearFilters = () => {
    setStatus([]);
    setStartDate("");
    setSearchTerm("");
    removeStorage("storyListFilters");
  };

  const hasSentProjectNameRef = useRef(false);

  const getKey = (pageIndex: number, previousPageData?: PaginatedStoryResponse | null) => {
    if (previousPageData && "data" in previousPageData && !previousPageData.data.length)
      return null;
    return `stories-${projectId}-${status.join(",")}-${startDate}-${searchTerm}-page-${pageIndex + 1}`;
  };

  const fetcher = async (_key: string) => {
    const page = Number(_key.split("page-").pop()) || 1;
    const result = await getStoriesByProject(projectId as string, {
      status,
      startDate,
      search: searchTerm,
      page,
      limit
    });

    if (
      !hasSentProjectNameRef.current &&
      "meta" in result &&
      typeof result.meta?.projectName === "string"
    ) {
      onProjectNameLoad?.(result.meta.projectName);
      hasSentProjectNameRef.current = true;
    }

    return result;
  };

  const { data, size, setSize, isLoading, isValidating, error } = useSWRInfinite(getKey, fetcher);

  const allStories: ProjectStory[] = data
    ? data
        .filter((page): page is PaginatedStoryResponse => "data" in page)
        .flatMap((page) => page.data)
    : [];

  const firstPage = data?.[0];
  const totalCount = firstPage && "pagination" in firstPage ? firstPage.pagination.totalCount : 0;
  const hasMore = allStories.length < totalCount;

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
    [isLoading, isValidating, hasMore, setSize]
  );

  const applyStatusFilter = (val: string[]) => {
    handleStatusChange(val);
    setSize(1);
  };

  const applyStartDateFilter = (val: string) => {
    handleStartDateChange(val);
    setSize(1);
  };

  const applySearchTermFilter = (val: string) => {
    handleSearchTermChange(val);
    setSize(1);
  };

  const resetAllFilters = () => {
    clearFilters();
    setSize(1);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {allStories.length === 0 && !status.length && !startDate && !searchTerm ? (
        <>
          <Box sx={{ pl: 2 }}>
            <IconButton color="primary" onClick={() => router.push(`/project/view/${projectId}`)}>
              <ArrowBack />
            </IconButton>
          </Box>

          <EmptyState imageSrc={NoSearchResultsImage} message={t("Stories.noStoriesFound")} />

          <Fab
            color="primary"
            onClick={() => router.push(`/project/view/${projectId}/stories/create`)}
            sx={{ position: "fixed", bottom: 35, right: 35, zIndex: 1000 }}
          >
            <AddIcon />
          </Fab>
        </>
      ) : (
        <>
          {/* Fixed Filters */}
          <Box sx={{ flexShrink: 0, py: 2 }}>
            <StoryFilters
              status={status}
              startDate={startDate}
              searchTerm={searchTerm}
              onStatusChange={applyStatusFilter}
              onStartDateChange={applyStartDateFilter}
              onSearchChange={applySearchTermFilter}
              onClearFilters={resetAllFilters}
              onBack={() => router.push(`/project/view/${projectId}`)}
            />
          </Box>

          {/* Scrollable List */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              maxHeight: { xs: "calc(95vh - 250px)", md: "calc(95vh - 150px)" }
            }}
          >
            <Box sx={{ px: 2, pt: 3 }}>
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
          </Box>

          {/* FAB */}
          <Fab
            color="primary"
            onClick={() => router.push(`/project/view/${projectId}/stories/create`)}
            sx={{ position: "fixed", bottom: 35, right: 35, zIndex: 1000 }}
          >
            <AddIcon />
          </Fab>
        </>
      )}
    </Box>
  );
};

export default StoryList;

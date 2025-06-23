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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Pagination,
  Button
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { ArrowBack, Add as AddIcon } from "@mui/icons-material";
import { getStoriesByProject } from "../services/projectStoryService";
import { ProjectStory } from "../interfaces/projectStory";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import StoryCard from "../components/StoryCard";

const StoryList: React.FC = () => {
  const { projectId } = useParams();
  const router = useRouter();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const limit = 8;

  const fetcher = async () => {
    const response = await getStoriesByProject(projectId as string, {
      status,
      startDate,
      endDate,
      page,
      limit
    });
    return response;
  };

  const swrKey = `stories-${projectId}-${status}-${startDate}-${endDate}-${page}`;
  const { data, isLoading, error } = useSWR(swrKey, fetcher);

  const stories: ProjectStory[] = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const projectName = stories[0]?.project?.name ?? "";

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
        <Typography variant="h6" fontWeight={600}>
          {t("Stories.titleWithProject", { name: projectName })}
        </Typography>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} px={2} pt={10} alignItems="center" flexWrap="wrap">
        {/* Status Filter */}
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="status-label" shrink>
            {t("Stories.filters.status")}
          </InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={status}
            label={t("Stories.filters.status")}
            displayEmpty
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
          >
            <MenuItem value="">{t("Stories.filters.all")}</MenuItem>
            <MenuItem value="to-do">{t("Stories.filters.toDo")}</MenuItem>
            <MenuItem value="in-progress">{t("Stories.filters.inProgress")}</MenuItem>
            <MenuItem value="done">{t("Stories.filters.done")}</MenuItem>
          </Select>
        </FormControl>

        {/* Start Date */}
        <TextField
          type="date"
          label={t("Stories.filters.startDate")}
          size="small"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => {
            setPage(1);
            setStartDate(e.target.value);
          }}
          sx={{ minWidth: 200 }}
        />

        {/* End Date */}
        <TextField
          type="date"
          label={t("Stories.filters.endDate")}
          size="small"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => {
            setPage(1);
            setEndDate(e.target.value);
          }}
          sx={{ minWidth: 200 }}
        />

        {/* Clear Filters Button */}
        <Tooltip title={t("Stories.filters.clearTooltip")}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setStatus("");
              setStartDate("");
              setEndDate("");
              setPage(1);
            }}
            sx={{ height: 40 }}
          >
            {t("Stories.filters.clearFilters")}
          </Button>
        </Tooltip>
      </Box>

      {/* Content */}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Floating Add Button */}
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

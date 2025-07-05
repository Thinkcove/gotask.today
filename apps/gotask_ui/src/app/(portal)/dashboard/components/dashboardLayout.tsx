"use client";

import React from "react";
import useSWR from "swr";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  Divider,
  Chip
} from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { fetchDashboardSummary } from "../../task/service/taskAction";
import { TaskStatuses, TaskSeverities } from "@/app/common/constants/task";
import StatusChart from "@/app/component/statusChart/statusChart";
import { ArrowUpward, Task, Warning, CheckCircle } from "@mui/icons-material";

const Dashboard: React.FC = () => {
  const trans = useTranslations(LOCALIZATION.TRANSITION.DASHBOARD);
  const { data, isLoading } = useSWR("dashboard-summary", fetchDashboardSummary, {
    revalidateOnFocus: false
  });

  if (isLoading || !data?.data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  const {
    statusCounts = {},
    severityCounts = {},
    totalCount = 0,
    completedCount = 0,
    progress = 0,
    overdueCount = 0,
    upcomingCount = 0
  } = data.data;

  return (
    <Box p={4} sx={{ bgcolor: "#f9f9fb", minHeight: "100vh" }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold">
          {trans("title")}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Get a quick overview of your task activity and status.
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} mb={4}>
        <KpiCard label={trans("totalTasks")} value={totalCount} icon={<Task />} color="#4caf50" />
        <KpiCard
          label={trans("completedTasks")}
          value={completedCount}
          icon={<CheckCircle />}
          color="#2196f3"
        />
        <KpiCard
          label={trans("progress")}
          value={`${progress}%`}
          icon={<ArrowUpward />}
          color="#9c27b0"
        />
        <KpiCard label={trans("overdue")} value={overdueCount} icon={<Warning />} color="#f44336" />
        <KpiCard label={trans("upcoming")} value={upcomingCount} icon={<Task />} color="#ff9800" />
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <AnalyticsCard
            title={trans("taskByStatus")}
            chartTitle={trans("tasks")}
            data={statusCounts}
            categories={TaskStatuses}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AnalyticsCard
            title={trans("taskBySeverity")}
            chartTitle={trans("tasks")}
            data={severityCounts}
            categories={TaskSeverities}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

const KpiCard = ({
  label,
  value,
  icon,
  color
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <Grid item xs={12} sm={6} md={2.4}>
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderLeft: `5px solid ${color}`,
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#fff"
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Box sx={{ color }}>{icon}</Box>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Paper>
  </Grid>
);

const AnalyticsCard = ({
  title,
  data,
  categories,
  chartTitle
}: {
  title: string;
  data: Record<string, number>;
  categories: { label: string; color: string }[];
  chartTitle: string;
}) => (
  <Paper elevation={2} sx={{ p: 3, borderRadius: 3, bgcolor: "#fff" }}>
    <Typography variant="h6" fontWeight={600} mb={2}>
      {title}
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <StatusChart statuses={categories} statusCounts={data} chartTitle={chartTitle} title="" />
    <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
      {categories.map((cat, idx) => {
        const value = data?.[cat.label.toLowerCase().replace(/\s/g, "-")] ?? 0;
        return (
          <Chip
            key={idx}
            label={`${cat.label}: ${value}`}
            sx={{
              bgcolor: `${cat.color}22`,
              color: cat.color,
              fontWeight: 600
            }}
          />
        );
      })}
    </Stack>
  </Paper>
);

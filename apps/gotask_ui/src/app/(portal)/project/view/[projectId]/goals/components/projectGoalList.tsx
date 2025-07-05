"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Box, CircularProgress } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import {
  formatStatus,
  GOAL_FILTER_STORAGE_KEY,
  priorityOptions,
  statusOptions
} from "@/app/common/constants/project";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { fetchWeeklyGoals } from "../goalservices/projectGoalAction";
import { GoalData } from "../interface/projectGoal";
import ProjectGoals from "./projectGoals";
import GoalFilterBar from "./goalFilterBar";

function getInitialGoalFilters() {
  if (typeof window === "undefined") {
    return {
      searchTerm: "",
      statusFilter: [],
      severityFilter: []
    };
  }

  try {
    const stored = localStorage.getItem(GOAL_FILTER_STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          searchTerm: "",
          statusFilter: [],
          severityFilter: []
        };
  } catch {
    return {
      searchTerm: "",
      statusFilter: [],
      severityFilter: []
    };
  }
}

function ProjectGoalList() {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  const { projectId } = useParams();
  const router = useRouter();

  const projectID = projectId as string;

  const initialFilters = getInitialGoalFilters();

  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm);
  const [statusFilter, setStatusFilter] = useState<string[]>(initialFilters.statusFilter);
  const [severityFilter, setSeverityFilter] = useState<string[]>(initialFilters.severityFilter);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allGoals, setAllGoals] = useState<GoalData[]>([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const updateFilterStorage = (next: {
    statusFilter?: string[];
    severityFilter?: string[];
    searchTerm?: string;
  }) => {
    const updated = {
      statusFilter: next.statusFilter ?? statusFilter,
      severityFilter: next.severityFilter ?? severityFilter,
      searchTerm: next.searchTerm ?? searchTerm
    };
    localStorage.setItem(GOAL_FILTER_STORAGE_KEY, JSON.stringify(updated));
  };

  const swrKey = `weekly-goals-${projectID}-${page}-${statusFilter.join(",")}-${severityFilter.join(",")}-${searchTerm}`;

  const { isLoading, error } = useSWR(
    swrKey,
    () =>
      fetchWeeklyGoals({
        projectId: projectID,
        page,
        pageSize: 10,
        status: statusFilter.length ? statusFilter[0] : undefined,
        priority: severityFilter.length ? severityFilter[0] : undefined,
        goalTitle: searchTerm || undefined
      }),
    {
      revalidateOnFocus: false,
      onSuccess: (res) => {
        if (res?.goals?.length < 10) {
          setHasMore(false);
        }

        // Reset goals when it's the first page or filters changed
        if (page === 1) {
          setAllGoals(res?.goals || []);
        } else {
          // Append new goals for pagination
          setAllGoals((prev) => {
            const existingIds = new Set(prev.map((goal) => goal.id));
            const newGoals = (res?.goals || []).filter(
              (goal: GoalData) => !existingIds.has(goal.id)
            );
            return [...prev, ...newGoals];
          });
        }
      }
    }
  );

  // Navigation handlers
  const handleCreateGoal = () => {
    router.push(`/project/view/${projectID}/goals/createGoal`);
  };

  const handleGoBack = () => {
    setTimeout(() => router.back(), 200);
  };

  // Updated view handler to use router navigation
  const handleProjectGoalView = (goalId: string) => {
    if (!goalId) {
      console.error("Goal ID is missing");
      return;
    }
    router.push(`/project/view/${projectID}/goals/view/${goalId}`);
  };

  // Filter handlers
  const onStatusChange = (selected: string[]) => {
    setStatusFilter(selected);
    setPage(1);
    updateFilterStorage({ statusFilter: selected });
  };

  const onSeverityChange = (selected: string[]) => {
    setSeverityFilter(selected);
    setPage(1);
    updateFilterStorage({ severityFilter: selected });
  };

  const onSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
    updateFilterStorage({ searchTerm: value });
  };

  const onClearFilters = () => {
    setStatusFilter([]);
    setSeverityFilter([]);
    setSearchTerm("");
    setPage(1);
    localStorage.removeItem(GOAL_FILTER_STORAGE_KEY);
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const filteredGoals = allGoals?.filter((goal) => {
    const matchesSearch =
      goal.goalTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter.length ? statusFilter.includes(goal.status) : true;
    const matchesSeverity = severityFilter.length ? severityFilter.includes(goal.priority) : true;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  if (isLoading && allGoals.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 2 }}>
      <GoalFilterBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onBack={handleGoBack}
        statusFilter={statusFilter}
        severityFilter={severityFilter}
        onStatusChange={onStatusChange}
        onSeverityChange={onSeverityChange}
        onClearFilters={onClearFilters}
        statusOptions={Object.values(statusOptions)}
        priorityOptions={Object.values(priorityOptions)}
        showClear={statusFilter.length > 0 || severityFilter.length > 0 || searchTerm !== ""}
        clearText={transGoal("clearall")}
        searchPlaceholder={transGoal("searchplaceholder")}
        filterpriority={transGoal("filterpriority")}
        filterstatus={transGoal("filterstatus")}
      />

      {filteredGoals?.length === 0 ? (
        <EmptyState imageSrc={NoAssetsImage} message={transGoal("nodatafound")} />
      ) : (
        <ProjectGoals
          projectGoals={filteredGoals}
          isLoading={isLoading}
          error={!!error}
          formatStatus={formatStatus}
          projectId={projectID}
          projectGoalView={handleProjectGoalView}
          handleScroll={handleScroll}
        />
      )}

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />

      {/* Floating Action Button */}
      <ActionButton
        label={transGoal("creategoal")}
        icon={<AddIcon sx={{ color: "white" }} />}
        onClick={handleCreateGoal}
      />
    </Box>
  );
}

export default ProjectGoalList;

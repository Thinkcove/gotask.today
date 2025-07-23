"use client";
import React, { useState } from "react";
import useSWR from "swr";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { formatStatus, priorityOptions, statusOptions } from "@/app/common/constants/project";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { fetchWeeklyGoals } from "../goalservices/projectGoalAction";
import { GoalData } from "../interface/projectGoal";
import ProjectGoals from "./projectGoals";
import GoalFilterBar from "./goalFilterBar";
import { getStoredObj, removeStorage, setStorage } from "@/app/common/utils/storage";
import { ArrowBack } from "@mui/icons-material";

function ProjectGoalList() {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  const { projectId } = useParams();
  const router = useRouter();

  const projectID = projectId as string;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allGoals, setAllGoals] = useState<GoalData[]>([]);

  const savedFilters = getStoredObj("projectGoalListFilter") || {};

  const [searchTerm, setSearchTerm] = useState<string>(savedFilters.searchTerm || "");
  const [statusFilter, setStatusFilter] = useState<string[]>(savedFilters.statusFilter || []);
  const [severityFilter, setSeverityFilter] = useState<string[]>(savedFilters.severityFilter || []);

  const saveFilters = (filters: {
    searchTerm?: string;
    statusFilter?: string[];
    severityFilter?: string[];
  }) => {
    setStorage("projectGoalListFilter", {
      searchTerm: filters.searchTerm ?? searchTerm,
      statusFilter: filters.statusFilter ?? statusFilter,
      severityFilter: filters.severityFilter ?? severityFilter
    });
  };

  const handleStatusFilterChange = (val: string[]) => {
    setStatusFilter(val);
    saveFilters({ statusFilter: val });
  };

  const handleSeverityFilterChange = (val: string[]) => {
    setSeverityFilter(val);
    saveFilters({ severityFilter: val });
  };

  const swrKey = `weekly-goals-${projectID}-${page}-${statusFilter.join(",")}-${severityFilter.join(",")}-${searchTerm}`;

  const { isLoading, error } = useSWR(
    swrKey,
    () =>
      fetchWeeklyGoals({
        projectId: projectID,
        page,
        pageSize: 30,
        status: statusFilter.length ? statusFilter[0] : undefined,
        priority: severityFilter.length ? severityFilter[0] : undefined,
        goalTitle: searchTerm || undefined
      }),
    {
      revalidateOnFocus: false,
      onSuccess: (res) => {
        if (res?.goals?.length < 30) {
          setHasMore(false);
        }

        if (page === 1) {
          setAllGoals(res?.goals || []);
        } else {
          const existingIds = new Set(allGoals.map((goal) => goal.id));
          const newGoals = (res?.goals || []).filter((goal: GoalData) => !existingIds.has(goal.id));
          setAllGoals((prev) => [...prev, ...newGoals]);
        }
      }
    }
  );

  const handleCreateGoal = () => {
    router.push(`/project/view/${projectID}/goals/createGoal`);
  };

  const handleGoBack = () => {
    setTimeout(() => router.back(), 200);
  };

  const handleProjectGoalView = (goalId: string) => {
    if (!goalId) {
      console.error("Goal ID is missing");
      return;
    }
    router.push(`/project/view/${projectID}/goals/view/${goalId}`);
  };

  const onStatusChange = (selected: string[]) => {
    handleStatusFilterChange(selected);
    setPage(1);
  };

  const onSeverityChange = (selected: string[]) => {
    handleSeverityFilterChange(selected);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    saveFilters({ searchTerm: value });
    setPage(1);
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const onClearFilters = () => {
    setStatusFilter([]);
    setSeverityFilter([]);
    setSearchTerm("");
    setPage(1);
    removeStorage("projectGoalListFilter");
  };



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

  const filteredGoals = allGoals?.filter((goal) => {
    const matchesProject = goal.projectId === projectID;

    const matchesSearchTerm = goal.goalTitle?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter.length > 0 ? statusFilter.includes(goal.status) : true;

    const matchesSeverity = severityFilter.length > 0 ? severityFilter.includes(goal.priority) : true;

    return matchesProject && matchesSearchTerm && matchesStatus && matchesSeverity;
  });

  const noGoalsForProject = allGoals.filter((goal) => goal.projectId === projectID).length === 0;
  const noFilteredResults = filteredGoals?.length === 0;
  const isFilterActive = statusFilter.length > 0 || severityFilter.length > 0 || searchTerm.trim() !== "";

  return (
    <Box>
      {noGoalsForProject && !isFilterActive ? (
        <>
          <Box sx={{ pl: 2, pt: 2 }}>
            <IconButton color="primary" onClick={handleGoBack}>
              <ArrowBack />
            </IconButton>
          </Box>
          <EmptyState imageSrc={NoAssetsImage} message={transGoal("nodatafound")} />
        </>
      ) : (
        <>
          <GoalFilterBar
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            onBack={handleGoBack}
            statusFilter={statusFilter}
            severityFilter={severityFilter}
            onStatusChange={onStatusChange}
            onSeverityChange={onSeverityChange}
            onClearFilters={onClearFilters}
            statusOptions={Object.values(statusOptions)}
            priorityOptions={Object.values(priorityOptions)}
            showClear={isFilterActive}
            clearText={transGoal("clearall")}
            searchPlaceholder={transGoal("searchplaceholder")}
            filterpriority={transGoal("filterpriority")}
            filterstatus={transGoal("filterstatus")}
          />

          {noFilteredResults ? (
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
        </>
      )}

      <ActionButton
        label={transGoal("creategoal")}
        icon={<AddIcon sx={{ color: "white" }} />}
        onClick={handleCreateGoal}
      />

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </Box>
  );
}

export default ProjectGoalList;

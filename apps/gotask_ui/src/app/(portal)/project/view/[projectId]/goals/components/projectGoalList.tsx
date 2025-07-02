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
import SearchBar from "@/app/component/searchBar/searchBar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { ArrowBack } from "@mui/icons-material";
import { fetchWeeklyGoals } from "../goalservices/projectGoalAction";
import { GoalData } from "../interface/projectGoal";
import ProjectGoals from "./projectGoals";
import FilterDropdown from "@/app/component/input/filterDropDown";

function ProjectGoalList() {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  const { projectId } = useParams();
  const router = useRouter();

  const projectID = projectId as string;

  const [searchTerm, setSearchTerm] = useState("");
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
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);

  // Create a unique SWR key that includes projectID
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
    router.push(`/project/view/${projectID}/goals/creategoal`);
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
  };

  const onSeverityChange = (selected: string[]) => {
    setSeverityFilter(selected);
    setPage(1);
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  // Filter goals based on search and filters (client-side filtering as backup)
  const filteredGoals = allGoals?.filter((goal) => {
    const matchesSearchTerm =
      goal.goalTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.length ? statusFilter.includes(goal.status) : true;
    const matchesSeverity = severityFilter.length ? severityFilter.includes(goal.priority) : true;
    return matchesSearchTerm && matchesStatus && matchesSeverity;
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
      {/* Header with search and filters */}
      <Box display="flex" justifyContent="space-between" pb={1} pr={2} flexWrap="wrap" gap={2}>
        {/* Left section: Back arrow + Search */}
        <Box
          display="flex"
          gap={{ xs: 0.5, sm: 1 }}
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ width: "100%" }}
        >
          {/* First row on mobile: Back button and search */}
          <Box
            display="flex"
            gap={1}
            alignItems="center"
            sx={{ width: { xs: "100%", sm: "auto" }, pl: 1 }}
          >
            <IconButton color="primary" onClick={handleGoBack}>
              <ArrowBack />
            </IconButton>
            <Box
              sx={{
                flexGrow: 1,
                maxWidth: { xs: "none", sm: 400 },
                minWidth: { xs: "auto", sm: 200 }
              }}
            >
              <SearchBar
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setPage(1);
                }}
                sx={{ width: "100%" }}
                placeholder={transGoal("searchplaceholder")}
              />
            </Box>
          </Box>

          {/* Second row on mobile: Filters */}
          <Box
            display="flex"
            alignItems="center"
            gap={{ xs: 1, sm: 2 }}
            px={{ xs: 8, sm: 2 }}
            py={{ xs: 1, sm: 1 }}
            justifyContent="flex-start"
            flexWrap="wrap"
            mt={{ xs: 1, sm: 0 }}
            sx={{
              width: "100%",
              "& .MuiFormControl-root": {
                minWidth: { xs: "auto", sm: "120px" },
                maxWidth: { xs: "auto", sm: "none" }
              }
            }}
          >
            <FilterDropdown
              label={transGoal("filterstatus")}
              options={Object.values(statusOptions)}
              selected={statusFilter}
              onChange={onStatusChange}
            />
            <FilterDropdown
              label={transGoal("filterpriority")}
              options={Object.values(priorityOptions)}
              selected={severityFilter}
              onChange={onSeverityChange}
            />
          </Box>
        </Box>
      </Box>

      {/* Filters */}

      {/* Goals List or Empty State */}
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

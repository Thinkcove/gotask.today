import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { formatStatus, priorityOptions, statusOptions } from "@/app/common/constants/project";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";
import { useUser } from "@/app/userContext";
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
  const { user } = useUser();

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
            const newGoals = (res?.goals || []).filter((goal: any) => !existingIds.has(goal.id));
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

  const handleEditGoal = (goal: GoalData) => {
    const goalID = goal.id;
    if (!goal.id) {
      console.error("Goal ID is missing");
      return;
    }

    router.push(`/project/view/${projectID}/goals/editgoal/${goalID}`);
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
    setHasMore(true);
    setAllGoals([]);
  };

  const onSeverityChange = (selected: string[]) => {
    setSeverityFilter(selected);
    setPage(1);
    setHasMore(true);
    setAllGoals([]);
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
      <Box display="flex" justifyContent="space-between" pb={2} pr={2} flexWrap="wrap" gap={2}>
        {/* Left section: Back arrow + Search */}
        <Box display="flex" pl={1} alignItems="center" gap={2} flexWrap="wrap">
          <IconButton color="primary" onClick={handleGoBack}>
            <ArrowBack />
          </IconButton>
          <Box maxWidth={400}>
            <SearchBar
              value={searchTerm}
              onChange={(value) => {
                setSearchTerm(value);
                setPage(1);
                setHasMore(true);
                setAllGoals([]);
              }}
              sx={{ width: "100%" }}
              placeholder={transGoal("searchplaceholder")}
            />
          </Box>
        </Box>
      </Box>

      {/* Filters */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        pb={1}
        pl={2}
        justifyContent=""
        flexWrap="wrap"
        mt={{ xs: 2, md: 0 }}
        sx={{ flexGrow: 1 }}
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

      {/* Goals List or Empty State */}
      {filteredGoals?.length === 0 ? (
        <EmptyState imageSrc={NoAssetsImage} message={transGoal("nodatafound")} />
      ) : (
        <ProjectGoals
          projectGoals={filteredGoals}
          isLoading={isLoading}
          error={!!error}
          formatStatus={formatStatus}
          handleEditGoal={handleEditGoal}
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

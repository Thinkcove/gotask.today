import React, { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { formatStatus, PROGECT_GOAL_SEVERITY, PROJECT_GOAL } from "@/app/common/constants/project";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";
import { useUser } from "@/app/userContext";
import SearchBar from "@/app/component/searchBar/searchBar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { ArrowBack, History } from "@mui/icons-material";
import router from "next/router";
import {
  createComment,
  createWeeklyGoal,
  deleteComment,
  fetchWeeklyGoals,
  getCommentsByGoalId,
  getWeeklyGoalById,
  updateComment,
  updateWeeklyGoal
} from "../../../services/projectAction";
import { GoalComment, GoalData } from "../interface/projectGoal";
import ProjectGoalView from "./projectGoalView";
import ProjectGoalForm from "./projectGoalForm";
import ProjectGoals from "./projectGoals";
import { TASK_SEVERITY, TASK_STATUS } from "@/app/common/constants/task";
import FilterDropdown from "@/app/component/input/filterDropDown";
import HistoryDrawer from "./history";

interface ProjectGoalListProps {
  onClose?: () => void; // optional callback prop
}

function ProjectGoalList({ onClose }: ProjectGoalListProps) {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  const { projectId } = useParams();
  const projectID = projectId as string;
  const [openDialog, setOpenDialog] = useState(false);

  const [goalData, setGoalData] = useState<GoalData>({
    goalTitle: "",
    description: "",
    weekStart: "",
    weekEnd: "",
    status: "",
    priority: "",
    projectId: projectID
  });
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

  const swrKey = [page, statusFilter, severityFilter, searchTerm];

  const { data, isLoading, error } = useSWR(
    swrKey,
    () =>
      fetchWeeklyGoals({
        page,
        pageSize: 10,
        status: statusFilter.length ? statusFilter[0] : undefined,
        priority: severityFilter.length ? severityFilter[0] : undefined
      }),
    {
      revalidateOnFocus: false,
      onSuccess: (res) => {
        if (res?.goals?.length < 10) {
          setHasMore(false); // No more pages
        }
        setAllGoals((prev) => {
          const existingIds = new Set(prev.map((goal) => goal.id));
          const newGoals = (res?.goals || []).filter((goal: any) => !existingIds.has(goal.id));
          return [...prev, ...newGoals];
        });
      }
    }
  );
  const [projectGoalHistory, setProjectGoalHistory] = useState<{
    updateHistory?: any[];
  } | null>(null);
  const fieldLabelMap = {
    goalTitle: "Goal Title",
    description: "Description",
    priority: "Priority",
    projectId: "Project ID",
    status: "Status",
    weekEnd: "Week End",
    weekStart: "Week Start"
  };

  // Create a new array with formatted history
  const formattedHistory =
    projectGoalHistory?.updateHistory?.map((item: any) => {
      const formattedChanges = Object.entries(item.update_data)
        .filter(([_, value]) => value !== "") // skip empty fields
        .map(([key, value]) => {
          const label = fieldLabelMap[key] || key;
          return `${label} updated to "${value}"`;
        });

      return {
        loginuser_name: "System", // or map from item.updated_by if needed
        formatted_history: formattedChanges.join(". "),
        created_date: item.timestamp
      };
    }) ?? [];
  
  const handelOpen = () => {
    setGoalData({
      goalTitle: "",
      projectId: projectID,
      status: "",
      description: "",
      priority: "",
      weekStart: "",
      weekEnd: ""
    });
    setOpenDialog(true);
  };

  const handleEditGoal = async (goal: GoalData) => {
    setGoalData({
      id: goal.id,
      goalTitle: goal.goalTitle || "",
      description: goal.description || "",
      weekStart: goal.weekStart || "",
      weekEnd: goal.weekEnd || "",
      status: goal.status || "",
      priority: goal.priority || "",
      projectId: goal.projectId || ""
    });

    try {
      const fetchedGoal = await getWeeklyGoalById(goal.id); // renamed to avoid conflict
      console.log("Goal Data:", fetchedGoal);

      setProjectGoalHistory({
        updateHistory: fetchedGoal.updateHistory || []
      });

      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching goal for edit:", error);
    }
  };
  

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!goalData.goalTitle) newErrors.goalTitle = transGoal("titlerequired");
    if (!goalData.weekStart) newErrors.weekStart = transGoal("startweekrequired");
    if (!goalData.weekEnd) newErrors.weekEnd = transGoal("endweekrequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        projectId: projectID,
        goalTitle: goalData.goalTitle,
        weekStart: goalData.weekStart,
        weekEnd: goalData.weekEnd,
        status: goalData.status,
        description: goalData.description,
        priority: goalData.priority
      };
      if (goalData.id) {
        await updateWeeklyGoal(goalData.id, payload as any);
        await handelProjectGoalView(goalData.id);
        setSnackbar({
          open: true,
          message: transGoal("goalupdate"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
      } else {
        await createWeeklyGoal(payload as any);
        setSnackbar({
          open: true,
          message: transGoal("savegoal"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
      }
      await mutate("project-goals");
      setOpenDialog(false);
    } catch (err) {
      console.error("Error saving weekly goal:", err);
      setSnackbar({
        open: true,
        message: transGoal("saveError"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const [projectGoalView, setprojectGoalView] = useState<
    (GoalData & { comments: GoalComment[] }) | null
  >(null);



  console.log("projectGoalHistory", projectGoalHistory);

  const handelProjectGoalView = async (goalId: string) => {
    console.log("Goal Data goalId:", goalId);

    try {
      const goal = await getWeeklyGoalById(goalId);
      console.log("Goal Data:", goal);

      const comments = await getCommentsByGoalId(goalId);
      const fullGoal = {
        ...goal.goal.data,
        comments: comments || []
      };

      setprojectGoalView(fullGoal);

      setProjectGoalHistory({
        updateHistory: goal.updateHistory || []
      });
    } catch (error) {
      console.error("Error fetching goal details:", error);
    }
  };


  const handleSaveComment = async (commentData: {
    goal_id: string;
    comment: string;
    user_id?: string;
  }) => {
    try {
      const payload = {
        goal_id: commentData.goal_id,
        user_id: commentData.user_id,
        comments: [commentData.comment]
      };
      await createComment(payload);
      await handelProjectGoalView(commentData.goal_id);
      setSnackbar({
        open: true,
        message: transGoal("goalSaved"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch (error) {
      await mutate("project-goals");
      setSnackbar({
        open: true,
        message: transGoal("goalfiled"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
      console.error("Error Project Goal View:", error);
    }
  };

  const handleEditComment = async (
    commentId: string | number,
    updatedComment: { comment: string }
  ) => {
    try {
      await updateComment(commentId, { comments: [updatedComment.comment] });
      if (projectGoalView?.id) {
        await handelProjectGoalView(projectGoalView.id);
      }
      setSnackbar({
        open: true,
        message: transGoal("goalupdate"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: transGoal("goalfiled"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
      console.error("Error Project Goal View:", err);
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {
    try {
      await deleteComment(commentId);
      if (projectGoalView?.id) {
        await handelProjectGoalView(projectGoalView.id);
      }
      setSnackbar({
        open: true,
        message: transGoal("deletegoal"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: transGoal("deletegoalfiled"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
      console.error("Error Project Goal Delete:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const { user } = useUser();
console.log();

  const onStatusChange = (selected: string[]) => {
    setStatusFilter(selected);
  };
  const onSeverityChange = (selected: string[]) => {
    setSeverityFilter(selected);
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    console.log("scrolling", scrollTop + clientHeight, scrollHeight);
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
    // let tepvab= allGoals.push(data?.goals || []);

    // setAllGoals((prev) => [...prev, ...(data.goals || [])]);
  };

  const filteredGoals = allGoals?.filter((goal) => {
    const matchesSearchTerm =
      goal.goalTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.length ? statusFilter.includes(goal.status) : true;
    const matchesSeverity = severityFilter.length ? severityFilter.includes(goal.priority) : true;
    return matchesSearchTerm && matchesStatus && matchesSeverity;
  });
  const [openDrawer, setOpenDrawer] = useState(false);
  console.log("openDrawer", openDrawer);

  if (!filteredGoals) {
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
    <>
      <Box sx={{ pt: 2 }}>
        {!openDialog && !projectGoalView && (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              pb={2}
              pr={2}
              flexWrap="wrap"
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <IconButton color="primary" onClick={() => onClose?.()}>
                  <ArrowBack />
                </IconButton>
                <Box maxWidth={400}>
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    sx={{ width: "100%" }}
                    placeholder={transGoal("searchplaceholder")}
                  />
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={2} mt={{ xs: 2, md: 0 }}>
                <FilterDropdown
                  label="Priority"
                  options={Object.values(PROJECT_GOAL)}
                  selected={statusFilter}
                  onChange={onStatusChange}
                />
                <FilterDropdown
                  label="Severity"
                  options={Object.values(PROGECT_GOAL_SEVERITY)}
                  selected={severityFilter}
                  onChange={onSeverityChange}
                />
              </Box>
            </Box>
          </>
        )}

        {projectGoalView ? (
          <ProjectGoalView
            goalData={projectGoalView}
            handleSaveComment={handleSaveComment}
            handleEditComment={handleEditComment}
            handleDeleteComment={handleDeleteComment}
            handleBack={handleBack}
            user={user}
          />
        ) : (
          <>
            <Box
              onClick={() => {
                console.log("Show History clicked");
                setOpenDrawer(true);
              }}
              sx={{
                textDecoration: "underline",
                display: "flex",
                gap: 1,
                color: "#741B92",
                px: 2,
                cursor: "pointer",
                alignItems: "center"
              }}
            >
              <Typography>{transGoal("showhistory")}</Typography>
              <History />
            </Box>
            {!openDialog && (
              <ActionButton
                label={transGoal("editgoal")}
                icon={<AddIcon sx={{ color: "white" }} />}
                onClick={handelOpen}
              />
            )}

            {openDialog ? (
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%"
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
                    {goalData.id ? transGoal("editgoal") : transGoal("creategoal")}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        borderRadius: "30px",
                        color: "black",
                        border: "2px solid #741B92",
                        px: 2,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.2)"
                        }
                      }}
                      onClick={() => setOpenDialog(false)}
                    >
                      {transGoal("cancel")}
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: "30px",
                        backgroundColor: "#741B92",
                        color: "white",
                        px: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor: "rgb(202, 187, 201)"
                        }
                      }}
                      onClick={handleSubmit}
                    >
                      {goalData.id ? transGoal("update") : transGoal("create")}
                    </Button>
                  </Box>
                </Box>

                <ProjectGoalForm
                  // projectGoalView={projectGoalView}
                  goalData={goalData}
                  setGoalData={setGoalData}
                  errors={errors}
                />
              </Box>
            ) : filteredGoals?.length === 0 ? (
              <EmptyState imageSrc={NoAssetsImage} message={transGoal("nodatafound")} />
            ) : (
              <>
                <ProjectGoals
                  projectGoals={filteredGoals}
                  isLoading={isLoading}
                  error={!!error}
                  formatStatus={formatStatus}
                  handleEditGoal={handleEditGoal}
                  projectId={projectID}
                  projectGoalView={handelProjectGoalView}
                  handleScroll={handleScroll} // Placeholder for scroll handling if needed
                />
              </>
            )}
          </>
        )}
        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
        />
        <HistoryDrawer
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          history={formattedHistory}
        />
      </Box>
    </>
  );
}

export default ProjectGoalList;

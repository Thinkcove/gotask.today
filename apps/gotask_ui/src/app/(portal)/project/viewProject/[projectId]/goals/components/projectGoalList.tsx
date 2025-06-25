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
} from "../goalservices/projectGoalAction";
import { GoalComment, GoalData } from "../interface/projectGoal";
import ProjectGoalView from "./projectGoalView";
import ProjectGoalForm from "./projectGoalForm";
import ProjectGoals from "./projectGoals";
import FilterDropdown from "@/app/component/input/filterDropDown";
import HistoryDrawer from "./history";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";

function ProjectGoalList() {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  const { projectId } = useParams();

  const { user } = useUser();
  console.log("user", user);
  const projectID = projectId as string;
  const [openDialog, setOpenDialog] = useState(false);

  const [goalData, setGoalData] = useState<GoalData>({
    goalTitle: "",
    description: "",
    weekStart: "",
    weekEnd: "",
    status: "",
    priority: "",
    projectId: projectID,
    updated_by: ""
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

  const fieldLabelMap: { [key: string]: string } = {
    goalTitle: "Goal Title",
    description: "Description",
    priority: "Priority",
    projectId: "Project ID",
    status: "Status",
    weekEnd: "Week End",
    weekStart: "Week Start"
  };
  const { data: users } = useSWR("fetch-user", fetcherUserList);

  const formattedHistory =
    projectGoalHistory?.updateHistory?.map((item: any) => {
      const updatedUser = users?.find((user: any) => user.id === item.updated_by);
      const loginuser_name = updatedUser?.first_name || updatedUser?.name || "System";

      const formattedChanges = Object?.entries(item.history_data)
        .filter(([key, value]) => value !== "" && key !== "weekStart" && key !== "weekEnd")
        .map(([key, value]) => {
          const label = fieldLabelMap[key] || key;
          return `${label} updated to "${value}"`;
        });

      return {
        loginuser_name: loginuser_name,
        formatted_history: formattedChanges.join(". "),
        created_date: item.timestamp // show timestamp, not weekEnd
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

    if (!goal.id) {
      console.error("Goal ID is missing");
      return;
    }

    try {
      const fetchedGoal = await getWeeklyGoalById(goal.id); // ✅ goal.id is definitely a string here
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
  const [history, setHistory] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!goalData.goalTitle) newErrors.goalTitle = transGoal("titlerequired");
    if (!goalData.weekStart) newErrors.weekStart = transGoal("startweekrequired");
    if (!goalData.weekEnd) newErrors.weekEnd = transGoal("endweekrequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleCancel = () => {
    // Optional: Reset form state or errors here
    setOpenDialog(false);
    setprojectGoalView(null);
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
        priority: goalData.priority,
        updated_by: user?.id
      };
      if (goalData.id) {
        await updateWeeklyGoal(goalData.id, payload as any);
        await handelProjectGoalView(goalData.id);
        setprojectGoalView(null);
        setSnackbar({
          open: true,
          message: transGoal("goalupdate"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
        await mutate("project-goals");
      } else {
        await createWeeklyGoal(payload as any);
        setSnackbar({
          open: true,
          message: transGoal("savegoal"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
        await mutate("project-goals");
      }
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
    setOpenDialog(false);
    setprojectGoalView(null);
  };

  const onStatusChange = (selected: string[]) => {
    setStatusFilter(selected);
    router.push(`/project/viewProject/${projectID}/goals`);
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
    if (scrollTop <= (scrollHeight - clientHeight) / 2) {
      console.log("User scrolled up past the middle");
      setPage((prev) => Math.max(prev - 1, 1)); // or whatever logic you want
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
  console.log("openDialog", openDialog);
  

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
              {/* Left section: Back arrow + Search */}
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <IconButton color="primary" onClick={handleBack}>
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

              {/* Right section: Filters aligned to flex-end */}
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                justifyContent="flex-end"
                flexWrap="wrap"
                mt={{ xs: 2, md: 0 }}
                sx={{ flexGrow: 1 }} // Optional: allows it to push to the right properly
              >
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
            {!openDialog && (
              <ActionButton
                label={goalData.id ? transGoal("editgoal") : transGoal("creategoal")}
                icon={<AddIcon sx={{ color: "white" }} />}
                onClick={handelOpen}
              />
            )}
            {openDialog && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    flexWrap: "wrap",
                    gap: 2
                  }}
                >
                  {/* Left Section: Arrow + Title */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center"
                      // gap: 2
                    }}
                  >
                    <IconButton color="primary" onClick={() => setOpenDialog(false)}>
                      <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
                      {goalData.id ? transGoal("editgoal") : transGoal("creategoal")}
                    </Typography>
                  </Box>

                  {/* Right Section: Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 2
                    }}
                  >
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
                      onClick={handleCancel}
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

                <Box
                  onClick={() => {
                    console.log("Show History clicked");
                    setHistory(true);
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
              </>
            )}
            {openDialog ? (
              <Box sx={{ p: 2 }}>
                <ProjectGoalForm goalData={goalData} setGoalData={setGoalData} errors={errors} />
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
                  handleScroll={handleScroll}
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
          open={history}
          onClose={() => setHistory(false)}
          history={formattedHistory}
          text={transGoal("log")}
          heading={transGoal("projectgoalhistory")}
        />
      </Box>
    </>
  );
}

export default ProjectGoalList;

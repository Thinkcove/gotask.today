"use client";
import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useUser } from "@/app/userContext";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import useSWR from "swr";
import {
  createComment,
  deleteComment,
  getCommentsByGoalId,
  getWeeklyGoalById,
  updateComment
} from "../../goalservices/projectGoalAction";
import { GoalComment, GoalData } from "../../interface/projectGoal";
import ProjectGoalView from "../../components/projectGoalView";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useAllProjects } from "@/app/(portal)/task/service/taskAction";

// Fetcher functions for SWR
const fetchGoalWithComments = async (goalId: string) => {
  if (!goalId) throw new Error("Goal ID is missing");

  const [goalResponse, commentsResponse] = await Promise.all([
    getWeeklyGoalById(goalId),
    getCommentsByGoalId(goalId)
  ]);

  if (!goalResponse || !goalResponse.data) {
    throw new Error("Goal not found");
  }

  const fullGoal: GoalData & { comments: GoalComment[] } = {
    ...goalResponse.data,
    comments: commentsResponse || []
  };

  return fullGoal;
};

const ProjectGoalViewPage = () => {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);
  const { getAllProjects } = useAllProjects();

  const router = useRouter();
  const { user } = useUser();

  const params = useParams();
  const projectId = params.projectId;

  // Try different possible parameter names
  const goalId = params.goalID || params.goalId || params.goal || params.id;

  const projectID = projectId as string;
  const goalID = goalId as string;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  // Use SWR for data fetching
  const {
    data: projectGoalView,
    isLoading,
    mutate
  } = useSWR(goalID ? `goal-${goalID}` : null, () => fetchGoalWithComments(goalID), {
    onError: (error) => {
      console.error("Error fetching goal details:", error);
      showSnackbar(
        error.message === "Goal not found"
          ? "Goal not found"
          : transGoal("fetchError") || "Error fetching goal data",
        SNACKBAR_SEVERITY.ERROR
      );
    },
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showSnackbar = (message: string, severity: string = SNACKBAR_SEVERITY.INFO) => {
    setSnackbar({
      open: true,
      message,
      severity: severity as SNACKBAR_SEVERITY
    });
  };

  // Refresh goal data using SWR mutate
  const refreshGoalData = async () => {
    if (!goalID) return;
    await mutate();
  };

  // Comment handlers
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
      await refreshGoalData();
      showSnackbar(transGoal("goalSaved"), SNACKBAR_SEVERITY.SUCCESS);
    } catch (error) {
      showSnackbar(transGoal("goalfiled"), SNACKBAR_SEVERITY.ERROR);
      console.error("Error saving comment:", error);
    }
  };

  const handleEditComment = async (
    commentId: string | number,
    updatedComment: { comment: string }
  ) => {
    try {
      await updateComment(commentId, { comments: [updatedComment.comment] });
      await refreshGoalData();
      showSnackbar(transGoal("goalupdate"), SNACKBAR_SEVERITY.SUCCESS);
    } catch (err) {
      showSnackbar(transGoal("goalfiled"), SNACKBAR_SEVERITY.ERROR);
      console.error("Error updating comment:", err);
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {
    try {
      await deleteComment(commentId);
      await refreshGoalData();
      showSnackbar(transGoal("deletegoal"), SNACKBAR_SEVERITY.SUCCESS);
    } catch (error) {
      showSnackbar(transGoal("deletegoalfiled"), SNACKBAR_SEVERITY.ERROR);
      console.error("Error deleting comment:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Handle loading state
  if (isLoading) {
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


  const handleEditGoal = (goal: GoalData) => {
    const goalID = goal.id;
    if (!goal.id) {
      console.error("Goal ID is missing");
      return;
    }

    router.push(`/project/view/${projectID}/goals/editGoal/${goalID}`);
  };

  // Step 2: Find current project
  const currentProject = getAllProjects?.find(
    (project: { id: string }) => project.id === projectID
  );

  return (
    <>
      <ModuleHeader name={currentProject?.name} />
      <Box sx={{ pt: 2 }}>
        <ProjectGoalView
          goalData={projectGoalView || null}
          handleSaveComment={handleSaveComment}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
          handleBack={handleBack}
          user={user}
          onEdit={handleEditGoal}
        />

        {/* Snackbar */}
        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={handleSnackbarClose}
        />
      </Box>
    </>
  );
};

export default ProjectGoalViewPage;

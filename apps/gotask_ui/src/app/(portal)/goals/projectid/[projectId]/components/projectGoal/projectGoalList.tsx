import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import ProjectGoals from "@/app/(portal)/goals/projectid/[projectId]/components/projectGoal/projectGoals";
import {
  createComment,
  createWeeklyGoal,
  deleteComment,
  fetchWeeklyGoals,
  getCommentsByGoalId,
  getWeeklyGoalById,
  updateComment,
  updateWeeklyGoal
} from "@/app/(portal)/goals/service/projectGoalAction";
import ProjectGoalForm from "@/app/(portal)/goals/projectid/[projectId]/components/projectGoal/projectGoalForm";
import {
  GoalComment,
  GoalData
} from "@/app/(portal)/goals/projectid/[projectId]/interface/projectGoal";
import { formatStatus } from "@/app/common/constants/project";
import ProjectGoalView from "@/app/(portal)/goals/projectid/[projectId]/components/projectGoal/projectGoalView";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoAssetsImage from "@assets/placeholderImages/notask.svg";
import { useUser } from "@/app/userContext";
import SearchBar from "@/app/component/searchBar/searchBar";

function ProjectGoalList() {
  const { data: weeklyGoals, error, isLoading } = useSWR("project-goals", fetchWeeklyGoals);
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

  const filteredGoals = weeklyGoals?.filter((goal: any) =>
    goal.goalTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleEditGoal = (goal: GoalData) => {
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

    setOpenDialog(true);
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
        // comments: commentTexts,
        priority: goalData.priority
      };

      if (goalData.id) {
        await updateWeeklyGoal(goalData.id, payload as any);
      } else {
        await createWeeklyGoal(payload as any);
      }
      await mutate("project-goals");
      setOpenDialog(false);
    } catch (err) {
      console.error("Error saving weekly goal:", err);
    }
  };
  const [projectGoalView, setprojectGoalView] = useState<
    (GoalData & { comments: GoalComment[] }) | null
  >(null);

  const handelProjectGoalView = async (goalId: string) => {
    try {
      const goal = await getWeeklyGoalById(goalId); // Get goal details
      const comments = await getCommentsByGoalId(goalId); // Get related comments

      // Merge comments into goal object
      const fullGoal = {
        ...goal,
        comments: comments || []
      };

      setprojectGoalView(fullGoal); // Set the full goal with comments
    } catch (error) {
      console.error("Failed to fetch goal view data:", error);
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

      console.log("Comment saved successfully");
    } catch (error) {
      console.error("Failed to save comment:", error);
    }
  };

  const handleEditComment = async (
    commentId: string | number,
    updatedComment: { comment: string }
  ) => {
    console.log("comment", updatedComment);

    try {
      await updateComment(commentId, {
        comments: [updatedComment.comment]
      });

      if (projectGoalView?.id) {
        await handelProjectGoalView(projectGoalView.id);
      }
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {
    try {
      await deleteComment(commentId);
      if (projectGoalView?.id) {
        await handelProjectGoalView(projectGoalView.id);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleBack = () => {
    setprojectGoalView(null);
  };
  const { user } = useUser();

  return (
    <Box sx={{ p: 4 }}>
      {filteredGoals?.length === 0 ? (
        ""
      ) : (
        <Box mb={3} maxWidth={400}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            sx={{ width: "100%" }}
            placeholder={transGoal("searchplaceholder")}
          />
        </Box>
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
              label={transGoal("editgoal")}
              icon={<AddIcon sx={{ color: "white" }} />}
              onClick={handelOpen}
            />
          )}

          {openDialog ? (
            <>
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
                      border: "2px solid  #741B92",
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
                      backgroundColor: " #741B92",
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
              <ProjectGoalForm goalData={goalData} setGoalData={setGoalData} errors={errors} />
            </>
          ) : filteredGoals?.length === 0 ? (
            <EmptyState imageSrc={NoAssetsImage} message={transGoal("nodatafound")} />
          ) : (
            <ProjectGoals
              projectGoals={filteredGoals}
              isLoading={isLoading}
              error={!!error}
              formatStatus={formatStatus}
              handelOpen={handelOpen}
              openDialog={openDialog}
              handleEditGoal={handleEditGoal}
              projectId={projectID}
              projectGoalView={handelProjectGoalView}
            />
          )}
        </>
      )}
    </Box>
  );
}

export default ProjectGoalList;

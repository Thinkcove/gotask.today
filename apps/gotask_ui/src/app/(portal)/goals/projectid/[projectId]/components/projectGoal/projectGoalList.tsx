import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import SearchBar from "@/app/component/searchBar/searchBar";
import ProjectGoals from "@/app/(portal)/goals/projectid/[projectId]/components/projectGoal/projectGoals";
import {
  createWeeklyGoal,
  fetchWeeklyGoals,
  getWeeklyGoalById,
  updateWeeklyGoal
} from "@/app/(portal)/goals/service/projectGoalAction";
import ProjectGoalForm from "@/app/(portal)/goals/projectid/[projectId]/components/projectGoal/projectGoalForm";
import {
  GoalData,
  GoalDataPayload
} from "@/app/(portal)/goals/projectid/[projectId]/interface/projectGoal";
import { GoalComment } from "@/app/(portal)/goals/projectid/[projectId]/interface/projectGoal";
import { formatStatus } from "@/app/common/constants/project";
import ProjectGoalView from "@/app/(portal)/goals/projectid/[projectId]/components/projectGoal/projectView";

function ProjectGoalList() {
  const { data: weeklyGoals, error, isLoading } = useSWR("project-goals", fetchWeeklyGoals);
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);

  const { projectId } = useParams();
  const projectID = projectId as string;
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [goalData, setGoalData] = useState<GoalData>({
    goalTitle: "",
    description: "",
    weekStart: "",
    weekEnd: "",
    status: "",
    priority: "",
    comments: [],
    projectId: projectID
  });

  const filteredGoals =
    weeklyGoals?.filter((goal: GoalData) =>
      goal.goalTitle.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handelOpen = () => {
    setGoalData({
      goalTitle: "",
      projectId: projectID,
      status: "",
      description: "",
      comments: [],
      priority: "",
      weekStart: "",
      weekEnd: ""
    });
    setOpenDialog(true);
  };

  const [newComment, setNewComment] = React.useState("");
  const [projectGoalView, setprojectGoalView] = React.useState("");

  const transformCommentsToObjects = (rawComments: any[]): GoalComment[] => {
    return rawComments.map((comment, index) => {
      if (typeof comment === "object" && comment.id && comment.comment) {
        return comment as GoalComment;
      }
      if (typeof comment === "string") {
        return {
          id: Date.now() + index,
          comment: comment,
          updatedAt: new Date().toISOString()
        };
      }
      return {
        id: Date.now() + index,
        comment: String(comment),
        updatedAt: new Date().toISOString()
      };
    });
  };

  const extractCommentTexts = (comments: GoalComment[]): string[] => {
    return comments.map((comment) => {
      if (typeof comment === "object" && comment.comment) {
        return comment.comment;
      }
      return String(comment);
    });
  };
  const handelProjectGoalView = async (goalId: string) => {
    console.log("goalId", goalId);

    try {
      const goal = await getWeeklyGoalById(goalId);
      setprojectGoalView(goal);
    } catch (error) {
      console.error("Failed to fetch goal by ID:", error);
    }
  };
  const handleEditGoal = (goal: GoalData) => {
    const rawComments = goal.comments || [];
    const transformedComments = transformCommentsToObjects(rawComments);

    setGoalData({
      id: goal.id,
      goalTitle: goal.goalTitle || "",
      description: goal.description || "",
      weekStart: goal.weekStart || "",
      weekEnd: goal.weekEnd || "",
      status: goal.status || "",
      priority: goal.priority || "",
      projectId: goal.projectId || "",
      comments: transformedComments
    });

    setNewComment("");
    setOpenDialog(true);
  };
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!goalData.goalTitle) newErrors.goalTitle = transGoal("titlerequired");
    if (!goalData.weekStart) newErrors.status = transGoal("startweekrequired");
    if (!goalData.weekEnd) newErrors.weekEnd = transGoal("endweekrequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const commentTexts = extractCommentTexts(goalData.comments);

      const payload = {
        projectId: projectID,
        goalTitle: goalData.goalTitle,
        weekStart: goalData.weekStart,
        weekEnd: goalData.weekEnd,
        status: goalData.status,
        description: goalData.description,
        comments: commentTexts,
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

  return (
    <Box sx={{ p: 4 }}>
      {projectGoalView ? (
        <ProjectGoalView
          goalData={projectGoalView}
          setGoalData={setprojectGoalView}
        />
      ) : (
        <>
          {!openDialog && (
            <>
              <Box mb={3} maxWidth={400}>
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  sx={{ width: "100%" }}
                  placeholder={transGoal("searchplaceholder")}
                />
              </Box>
              <ActionButton
                label={transGoal("editgoal")}
                icon={<AddIcon sx={{ color: "white" }} />}
                onClick={handelOpen}
              />
            </>
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
                  {goalData.id ? transGoal("editgoal") : transGoal("creategoal")}{" "}
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
              <ProjectGoalForm
                newComment={newComment}
                setNewComment={setNewComment}
                goalData={goalData}
                setGoalData={setGoalData}
                errors={errors}
              />
            </>
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

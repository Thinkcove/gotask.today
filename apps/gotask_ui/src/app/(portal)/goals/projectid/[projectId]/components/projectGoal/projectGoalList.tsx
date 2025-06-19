// GoalsList.tsx
import React, { useState } from "react";
import useSWR, { mutate } from "swr";

import { Box, Button, Typography } from "@mui/material";
import { useParams, useSearchParams } from "next/navigation";
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import SearchBar from "@/app/component/searchBar/searchBar";

import ProjectGoals, { ProjectGoal } from "./projectGoals";
import {
  createWeeklyGoal,
  fetchWeeklyGoals,
  updateWeeklyGoal
} from "@/app/(portal)/goals/service/projectGoalAction";
import ProjectGoalForm from "./projectGoalForm";

// Define the GoalData type
type GoalData = {
  goalTitle: string;
  description: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  priority: string;
  projectId?: string;
  comments: string[];
  id?: string;
};

function ProjectGoalList() {
  const { data: weeklyGoals, error, isLoading } = useSWR("project-goals", fetchWeeklyGoals);
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.WEEKLYGOAL);

  const { projectId } = useParams();
  const projectID = projectId as string;
  console.log("projectID--------->", projectID);
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
    weeklyGoals?.filter((goal: ProjectGoal) =>
      goal.goalTitle.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];
  console.log("filteredGoals", filteredGoals);

  const formatStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case "not-started":
        return "Not Started";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "blocked":
        return "Blocked";
      default:
        return "Unknown";
    }
  };

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

  const handleEditGoal = (goal: ProjectGoal) => {
    const rawComments = goal.comments;

    let safeComments: string[] = [];
    if (Array.isArray(rawComments) && rawComments.every((c) => typeof c === "string")) {
      safeComments = rawComments;
    }

    setGoalData({
      id: goal.id,
      goalTitle: goal.goalTitle || "",
      description: goal.description || "",
      weekStart: goal.weekStart || "",
      weekEnd: goal.weekEnd || "",
      status: goal.status || "",
      priority: goal.priority || "",
      projectId: goal.projectId || "",
      comments: safeComments
    });

    setNewComment("");
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        projectId: projectID,
        goalTitle: goalData.goalTitle,
        weekStart: goalData.weekStart,
        weekEnd: goalData.weekEnd,
        status: goalData.status,
        description: goalData.description,
        comments: goalData.comments,
        priority: goalData.priority
      };

      if (goalData.id) {
        await updateWeeklyGoal(goalData.id, payload);
      } else {
        await createWeeklyGoal(payload);
      }
      await mutate("project-goals");
      setOpenDialog(false);
    } catch (err) {
      console.error("Error saving weekly goal:", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
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
            label={transGoal("createnewpGoal")}
            icon={<AddIcon sx={{ color: "white" }} />}
            onClick={handelOpen}
          />
        </>
      )}

      {openDialog ? (
        <Box
          sx={{
            mt: 3,
            p: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
            backgroundColor: "#f9f9f9"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
              {goalData.id ? "Edit Weekly Goal" : "Create Weekly Goal"}
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
                {goalData.id ? "Update" : "Create"}
              </Button>
            </Box>
          </Box>
          <ProjectGoalForm
            newComment={newComment}
            setNewComment={setNewComment}
            goalData={goalData}
            setGoalData={setGoalData}
          />
        </Box>
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
        />
      )}
    </Box>
  );
}

export default ProjectGoalList;

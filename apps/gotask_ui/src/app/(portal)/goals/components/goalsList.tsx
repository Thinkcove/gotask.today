import React, { useState } from "react";
import useSWR from "swr";
import {
  createWeeklyGoal,
  fetchWeeklyGoals,
  updateWeeklyGoal
} from "../../project/services/projectAction";
import WeeklyGoals, { WeeklyGoal } from "./weeklyGoal/weeklyGoals";
import WeeklyGoalForm from "./weeklyGoal/weeklyGoalForm";
import { Box, Button, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

function GoalsList() {
  const { data: weeklyGoals, error, isLoading } = useSWR("weekly-goals", fetchWeeklyGoals);
  console.log("weeklyGoals", weeklyGoals);

  const [openDialog, setOpenDialog] = useState(false);
  const [goalData, setGoalData] = useState<any>({});

  const searchParams = useSearchParams();
  const projectID = searchParams.get("projectId") || "";

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
      comments: "",
      priority: ""
    });
    setOpenDialog(true);
  };
  const [editGoal, setEditGoal] = useState<WeeklyGoal | null>(null);
  console.log("editGoal", editGoal);

  const handleEditGoal = (goal: WeeklyGoal) => {
    setEditGoal(goal);
    setGoalData(goal);
    setOpenDialog(true);
  };
  const handleSubmit = async () => {
    try {
      const payload = {
        projectId: goalData.projectId,
        goalTitle: goalData.goalTitle,
        weekStart: goalData.weekStart,
        weekEnd: goalData.weekEnd,
        status: goalData.status,
        description: goalData.description,
        comments: goalData.comments,
        priority: goalData.priority
      };

      if (goalData.id) {
        // Edit mode
        await updateWeeklyGoal(goalData.id, payload);
      } else {
        // Create mode
        await createWeeklyGoal(payload);
      }

      // Optional: refresh goal list here
      setOpenDialog(false); // Close dialog
    } catch (err) {
      console.error("Error saving weekly goal:", err);
    }
  };
  return (
    <Box
      sx={{
        p: 4
      }}
    >
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
          <Typography variant="h6" mb={2}>
            {goalData.id ? "Edit Weekly Goal" : "Create Weekly Goal"}
          </Typography>

          <WeeklyGoalForm goalData={goalData} setGoalData={setGoalData} />

          <Box mt={2} display="flex" gap={2}>
            <Button variant="outlined" color="secondary" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="outlined" color="primary" onClick={handleSubmit}>
              {goalData.id ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              borderRadius: 4,
              p: 4,
              bgcolor: "#f9fafb",
              border: "1px solid #e0e0e0"
            }}
          >
            <WeeklyGoals
              weeklyGoals={weeklyGoals || []}
              isLoading={isLoading}
              error={!!error}
              formatStatus={formatStatus}
              handelOpen={handelOpen}
              openDialog={openDialog}
              handleEditGoal={handleEditGoal}
              projectId={Array.isArray(projectID) ? projectID[0] : (projectID ?? "")}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export default GoalsList;

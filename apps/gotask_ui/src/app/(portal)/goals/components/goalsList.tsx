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
import ActionButton from "@/app/component/floatingButton/actionButton";
import AddIcon from "@mui/icons-material/Add";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

function GoalsList() {
  const { data: weeklyGoals, error, isLoading } = useSWR("weekly-goals", fetchWeeklyGoals);
  console.log("weeklyGoals", weeklyGoals);
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.WEEKLYGOAL);

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
      <ActionButton
        label={transGoal("createnewpGoal")}
        icon={<AddIcon sx={{ color: "white" }} />}
        onClick={() => setOpenDialog(true)}
      />
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
            {/* Title with Gradient Effect */}
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
              {goalData.id ? "Edit Weekly Goal" : "Create Weekly Goal"}
            </Typography>

            {/* Buttons with Soft Hover Effects */}
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
                cancle
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
                    backgroundColor: "rgb(202, 187, 201) 100%)"
                  }
                }}
                onClick={handleSubmit}
              >
                {goalData.id ? "Update" : "Create"}
              </Button>
            </Box>
          </Box>
          <WeeklyGoalForm goalData={goalData} setGoalData={setGoalData} />
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

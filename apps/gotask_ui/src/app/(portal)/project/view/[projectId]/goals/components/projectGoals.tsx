import React from "react";
import { Grid, Box } from "@mui/material";
import { GoalData, ProjectGoalsProps } from "../interface/projectGoal";
import GoalItem from "./goalItem";

const ProjectGoals: React.FC<ProjectGoalsProps> = ({
  projectGoals,
  projectGoalView,
  projectId,
  handleScroll
}) => {
  const filteredGoals = projectGoals?.filter((goal) => goal.projectId === projectId);

  return (
    <Box sx={{ width: "100%", pt: 4 }}>
      <Box
        sx={{ overflowY: "auto", maxHeight: "calc(100vh - 250px)", px: 2 }}
        onScroll={handleScroll}
      >
        <Grid container spacing={2}>
          {filteredGoals?.map((goal:GoalData) => (
            <Grid item key={goal.id} xs={12} sm={6} md={4} lg={4} xl={3}>
              <GoalItem
                goal={goal}
                onClick={() => projectGoalView(goal.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProjectGoals;

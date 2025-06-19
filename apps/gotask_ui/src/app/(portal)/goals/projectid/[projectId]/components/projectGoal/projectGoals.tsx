import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import GoalCard from "./GoalCard";

export interface ProjectGoal {
  comments(comments: any): unknown;
  priority: string;
  weekEnd: string;
  weekStart: string;
  description: string;
  id: string;
  goalTitle: string;
  status: string;
  projectId: string;
}

interface ProjectGoalsProps {
  projectGoals: ProjectGoal[];
  isLoading: boolean;
  error: boolean;
  formatStatus: (status: string) => string;
  openDialog: boolean;
  handelOpen: (open: boolean) => void;
  handleEditGoal: (goal: ProjectGoal) => void;
  projectId: string;
}

const ProjectGoals: React.FC<ProjectGoalsProps> = ({ projectGoals, projectId, handleEditGoal }) => {
  const filteredGoals = projectGoals.filter((goal) => goal.projectId === projectId);

  return (
    <Box sx={{ width: "100%" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Project Goals
        </Typography>
      </Box>

      {filteredGoals.length > 0 ? (
        <Box sx={{ overflowY: "auto", maxHeight: "calc(100vh - 250px)", px: 2 }}>
          <Grid container spacing={2}>
            {filteredGoals.map((goal) => (
              <Grid item key={goal.id} xs={12} sm={6} md={4} lg={4} xl={3}>
                <GoalCard goal={goal} onEdit={handleEditGoal} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Typography>No project goals found.</Typography>
      )}
    </Box>
  );
};

export default ProjectGoals;

import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { ProjectGoalsProps } from "../interface/projectGoal";
import GoalItem from "./goalItem";

const ProjectGoals: React.FC<ProjectGoalsProps> = ({
  projectGoals,
  projectGoalView,
  projectId,
  handleEditGoal
}) => {
  const filteredGoals = projectGoals?.filter((goal) => goal.projectId === projectId);
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);


  return (
    <Box sx={{ width: "100%" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600} sx={{pl:2}}>
          {transGoal("projectgoals")}
        </Typography>
      </Box>

      <Box sx={{ overflowY: "auto", maxHeight: "calc(100vh - 250px)", px: 2 }}>
        <Grid container spacing={2}>
          {filteredGoals?.map((goal: any) => (
            <Grid item key={goal.id} xs={12} sm={6} md={4} lg={4} xl={3}>
              <GoalItem
                goal={goal}
                onEdit={handleEditGoal}
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

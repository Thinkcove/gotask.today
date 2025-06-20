import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import GoalCard from "@/app/(portal)/goals/projectid/[projectId]/components/projectGoal/GoalCard";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { ProjectGoalsProps } from "@/app/(portal)/goals/projectid/[projectId]/interface/projectGoal";

const ProjectGoals: React.FC<ProjectGoalsProps> = ({ projectGoals, projectId, handleEditGoal }) => {
  const filteredGoals = projectGoals.filter((goal) => goal.projectId === projectId);
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);

  return (
    <Box sx={{ width: "100%" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          {transGoal("projectgoals")}
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
        <Typography> {transGoal("nodatafound")}</Typography>
      )}
    </Box>
  );
};

export default ProjectGoals;

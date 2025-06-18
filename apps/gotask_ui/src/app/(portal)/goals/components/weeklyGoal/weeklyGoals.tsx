import React from "react";
import { Grid, Box, Typography, Button, Tooltip, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/task";

export interface WeeklyGoal {
  id: string;
  goalTitle: string;
  status: string;
  projectId: string;
}

interface WeeklyGoalsProps {
  weeklyGoals: WeeklyGoal[];
  isLoading: boolean;
  error: boolean;
  formatStatus: (status: string) => string;
  openDialog: boolean;
  handelOpen: (open: boolean) => void;
  handleEditGoal: (goal: WeeklyGoal) => void;
  projectId: string;
}

const WeeklyGoals: React.FC<WeeklyGoalsProps> = ({
  weeklyGoals,
  formatStatus,
  handelOpen,
  projectId,
  handleEditGoal
}) => {
  console.log("projectId", projectId);
  const filteredGoals = weeklyGoals.filter((goal) => goal.projectId === projectId);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Weekly Goals
        </Typography>
        <Button variant="contained" onClick={() => handelOpen(true)}>
          Create Goal
        </Button>
      </Box>

      {filteredGoals.length > 0 ? (
        <Grid container spacing={3} sx={{ maxHeight: "500px", overflowY: "auto" }}>
          {filteredGoals.map((goal) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={goal.id}>
              <Box
                sx={{
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  backgroundColor: "#fff"
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  {goal.goalTitle}
                </Typography>

                <StatusIndicator status={goal.status} getColor={getStatusColor} />

                <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                  <Box display="flex" alignItems="center">
                    {goal.status?.toLowerCase() === "completed" ? (
                      <>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Completion:
                        </Typography>
                        <input type="checkbox" disabled checked />
                      </>
                    ) : (
                      ""
                    )}
                  </Box>
                  <Tooltip title={"editaccess"}>
                    <IconButton onClick={() => handleEditGoal(goal)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No weekly goals found.</Typography>
      )}

      {/* Create Goal Dialog */}
    </>
  );
};

export default WeeklyGoals;

import React from "react";
import { Grid, Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getStatusColor } from "@/app/common/constants/task";

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

const ProjectGoals: React.FC<ProjectGoalsProps> = ({
  projectGoals,
  formatStatus,
  handelOpen,
  projectId,
  handleEditGoal
}) => {
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
            {filteredGoals.map((goal) => {
              const color = getStatusColor(goal.status);
              return (
                <Grid item key={goal.id} xs={12} sm={6} md={4} lg={4} xl={3}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: `${color}12`,
                      border: `1px solid ${color}40`,
                      transition: "all 0.2s ease-in-out",
                      cursor: "default",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      justifyContent: "space-between",
                      "&:hover": {
                        boxShadow: `0 0 6px ${color}66`
                      }
                    }}
                  >
                    <Box>
                      {/* Goal Title */}
                      <Typography
                        variant="subtitle1"
                        fontWeight={500}
                        textTransform="capitalize"
                        sx={{ mb: 1 }}
                      >
                        {goal.goalTitle}
                      </Typography>

                      {/* Status Indicator */}
                      <StatusIndicator status={goal.status} getColor={getStatusColor} />

                      {/* Completed Checkbox */}
                      {goal.status?.toLowerCase() === "completed" && (
                        <Box display="flex" alignItems="center" mt={1}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            Completion:
                          </Typography>
                          <input type="checkbox" disabled checked />
                        </Box>
                      )}
                    </Box>

                    {/* Edit Button */}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Tooltip title="Edit Goal">
                        <IconButton onClick={() => handleEditGoal(goal)} color="primary">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ) : (
        <Typography>No project goals found.</Typography>
      )}
    </Box>
  );
};

export default ProjectGoals;

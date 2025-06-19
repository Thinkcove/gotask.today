import React from "react";
import { Grid, Box, Typography, Button, Tooltip, IconButton } from "@mui/material";
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
  console.log("projectId", projectId);
  console.log("list gol ", projectId);
  
  const filteredGoals = projectGoals.filter((goal) => goal.projectId === projectId);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Project Goals
        </Typography>
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
        <Typography>No project goals found.</Typography>
      )}

      {/* Create Goal Dialog */}
    </>
  );
};

export default ProjectGoals;

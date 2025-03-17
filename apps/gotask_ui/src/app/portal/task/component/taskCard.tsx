import React from "react";
import { Typography, Paper, Box, Divider } from "@mui/material";
import { getStatusColor } from "@/app/common/constants/task";

const TaskCard: React.FC<{ view: "projects" | "users"; group: any }> = ({
  view,
  group,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid #741B92",
        transition: "0.3s",
        "&:hover": { boxShadow: "0px 4px 10px rgba(156, 32, 240, 0.6)" },
        height: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {group._id}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Total Tasks: {group.total_count}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Box sx={{ flexGrow: 1, maxHeight: 140, overflowY: "auto", pr: 1 }}>
        {group.tasks.length > 0 ? (
          group.tasks.map((task: any) => (
            <Box
              key={task._id}
              sx={{
                display: "flex",
                alignItems: "flex-start", // Align items at the start
                gap: 1,
                mb: 1,
              }}
            >
              {/* Status Indicator - Aligned to the Task Title */}
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: getStatusColor(task.status),
                  mt: "4px", // Moves it slightly down to align with the title
                  flexShrink: 0,
                }}
              />

              {/* Task Title & Description */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  sx={{ display: "block" }}
                >
                  {task.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {task.description}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" align="center">
            No tasks available
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default TaskCard;

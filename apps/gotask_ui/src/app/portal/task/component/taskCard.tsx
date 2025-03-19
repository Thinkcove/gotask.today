import React from "react";
import { Typography, Paper, Box, Divider, Chip } from "@mui/material";
import { getStatusColor } from "@/app/common/constants/task";
import { formatDate } from "@/app/common/utils/common";

interface TaskCardProps {
  view: "projects" | "users";
  group: any;
  onTaskClick: (task: any) => void; // Callback function
}

const TaskCard: React.FC<TaskCardProps> = ({ view, group, onTaskClick }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 3,
        borderLeft: "5px solid #741B92",
        transition: "0.3s",
        "&:hover": { boxShadow: "0px 4px 10px rgba(156, 32, 240, 0.6)" },
        height: 220,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {group._id}
        </Typography>
        <Chip
          label={`Total Tasks: ${group.total_count}`}
          size="small"
          sx={{ backgroundColor: "#741B92", color: "white" }}
        />
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
        {group.tasks.length > 0 ? (
          group.tasks.map((task: any) => (
            <Box
              key={task._id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
                p: 1,
                backgroundColor: "white",
                borderRadius: 2,
                transition:
                  "background-color 0.3s ease-in-out, border-left-color 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: getStatusColor(task.status),
                },
                cursor: "pointer",
                borderLeft: `5px solid ${getStatusColor(task.status)}`,
              }}
              onClick={() => onTaskClick(task.id)}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                {/* Task Title & Due Date */}
                <Typography variant="subtitle2" fontWeight="bold">
                  {task.title}
                </Typography>

                <Typography variant="subtitle2" fontWeight="bold">
                  {formatDate(task.due_date)}
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

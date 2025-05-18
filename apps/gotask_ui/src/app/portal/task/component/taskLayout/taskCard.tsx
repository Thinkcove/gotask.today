import React from "react";
import { Box, Typography } from "@mui/material";
import { IGroup, ITask } from "../../interface/taskInterface";
import TaskCard from "./taskListItem";

interface Props {
  view: "projects" | "users";
  group: IGroup;
  onTaskClick: (id: string) => void;
}

const TaskListGrouped: React.FC<Props> = ({ group, view, onTaskClick }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          px: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(45deg, rgb(194, 158, 206), rgb(229, 223, 230))",
          borderRadius: "6px",
          mb: 2
        }}
      >
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, textTransform: "capitalize" }}>
          {view === "projects" ? group.project_name : group.user_name}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {group.tasks.map((task: ITask) => (
          <TaskCard key={task.id} task={task} view={view} onClick={() => onTaskClick(task.id)} />
        ))}
      </Box>
    </Box>
  );
};

export default TaskListGrouped;

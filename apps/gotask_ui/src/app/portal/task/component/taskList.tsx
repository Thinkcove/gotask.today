"use client";

import React, { useState } from "react";
import {
  CircularProgress,
  Typography,
  Grid,
  Box,
  Tooltip,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useProjectGroupTask, useUserGroupTask } from "../service/taskAction";
import TaskToggle from "./taskToggle";
import StatusIndicator from "./statusIndicator";
import TaskCard from "./taskCard";
import { useRouter } from "next/navigation";

const TaskList: React.FC = () => {
  const [view, setView] = useState<"projects" | "users">("projects");
  const router = useRouter();
  const {
    tasksByProjects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects,
  } = useProjectGroupTask(1, 10);
  const {
    tasksByUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useUserGroupTask(1, 10);

  const isLoading = view === "projects" ? isLoadingProjects : isLoadingUsers;
  const isError = view === "projects" ? isErrorProjects : isErrorUsers;
  const tasks = view === "projects" ? tasksByProjects : tasksByUsers;

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Typography color="error" align="center" mt={4}>
        Failed to fetch tasks
      </Typography>
    );

  return (
    <Box>
      <TaskToggle view={view} setView={setView} />
      <StatusIndicator />

      <Grid container spacing={3} sx={{ p: 2 }}>
        {tasks.map((group: any) => (
          <Grid item xs={12} sm={6} md={4} key={group._id}>
            <TaskCard view={view} group={group} />
          </Grid>
        ))}
      </Grid>

      <Box position="fixed" bottom={16} right={12}>
        <Tooltip title="Create New Task" arrow>
          <Fab
            color="primary"
            sx={{
              backgroundColor: "#741B92",
              "&:hover": { backgroundColor: "#5E1374" },
            }}
            onClick={() => router.push("/portal/task/createTask")} // Navigate on click
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default TaskList;

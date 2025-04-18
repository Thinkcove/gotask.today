import React, { useState } from "react";
import { CircularProgress, Typography, Grid, Box, Tooltip, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useProjectGroupTask, useUserGroupTask } from "../service/taskAction";
import TaskToggle from "./taskToggle";
import StatusIndicator from "./statusIndicator";
import { useRouter } from "next/navigation";
import TaskCard from "./taskCard";
import ViewMoreList from "./viewMoreList";
import { IGroup } from "../interface/taskInterface";

const TaskList: React.FC = () => {
  const [view, setView] = useState<"projects" | "users">("projects");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [searchParams, setSearchParams] = useState<{
    search_vals?: string[][];
    search_vars?: string[][];
  }>({});

  const router = useRouter();
  const {
    tasksByProjects,
    isLoading: isLoadingProjects,
    isError: isErrorProjects
  } = useProjectGroupTask(1, 10, 1, 10);
  const {
    tasksByUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers
  } = useUserGroupTask(1, 10, 1, 10);

  const isLoading = view === "projects" ? isLoadingProjects : isLoadingUsers;
  const isError = view === "projects" ? isErrorProjects : isErrorUsers;
  const tasks = view === "projects" ? tasksByProjects : tasksByUsers;

  const { tasksByProjects: projectTasks, isLoading: projectIsLoading } =
    view === "projects"
      ? useProjectGroupTask(1, 10, 1, 10, searchParams.search_vals, searchParams.search_vars)
      : { tasksByProjects: [], isLoading: false };

  const { tasksByUsers: userTasks, isLoading: userIsLoading } =
    view === "users"
      ? useUserGroupTask(1, 10, 1, 10, searchParams.search_vals, searchParams.search_vars)
      : { tasksByUsers: [], isLoading: false };

  const handleTaskClick = (id: string) => {
    router.push(`/portal/task/editTask/${id}`);
  };

  const handleViewMore = (id: string) => {
    setSelectedGroupId(id);
    setSearchParams({
      search_vals: [[id.toString()]],
      search_vars: [["id"]]
    });
  };

  const handleCloseDrawer = () => {
    setSelectedGroupId("");
    setSearchParams({});
  };

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

      <Box sx={{ overflowY: "auto", maxHeight: "calc(100vh - 250px)", mb: 24 }}>
        <Grid container spacing={3} sx={{ p: 2 }}>
          {tasks.map((group: IGroup) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <TaskCard
                view={view}
                group={group}
                onTaskClick={handleTaskClick}
                onViewMore={handleViewMore}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box position="fixed" bottom={16} right={12}>
        <Tooltip title="Create New Task" arrow>
          <Fab
            color="primary"
            sx={{
              backgroundColor: "#741B92",
              "&:hover": { backgroundColor: "#5E1374" }
            }}
            onClick={() => router.push("/portal/task/createTask")}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Drawer Component */}
      <ViewMoreList
        open={Boolean(selectedGroupId)}
        selectedGroupId={selectedGroupId}
        drawerTasks={view === "projects" ? projectTasks : userTasks}
        isLoadingDrawer={view === "projects" ? projectIsLoading : userIsLoading}
        onClose={handleCloseDrawer}
        onTaskClick={handleTaskClick}
        view={view}
      />
    </Box>
  );
};

export default TaskList;

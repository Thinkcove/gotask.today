import React from "react";
import { Box, CircularProgress, Grid } from "@mui/material";
import TaskItem, { Task } from "../taskLayout/taskItem";
import { getStatusColor } from "@/app/common/constants/task";
import { formatDate } from "@/app/common/utils/common";
import { IGroup } from "../../interface/taskInterface";

interface ViewMoreListProps {
  selectedGroupId: string;
  drawerTasks: IGroup[];
  isLoadingDrawer: boolean;
  onTaskClick: (id: string) => void;
  view: string;
}

const ViewMoreList: React.FC<ViewMoreListProps> = ({
  selectedGroupId,
  drawerTasks,
  isLoadingDrawer,
  onTaskClick,
  view
}) => {
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Box sx={{ flex: 1 }}>
        {isLoadingDrawer ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          drawerTasks.map((group: IGroup) =>
            group.id === selectedGroupId ? (
              <Box key={group.id} sx={{ display: "flex", flexDirection: "column" }}>
                {/* Header */}

                {/* Task List with Responsive Grid */}
                <Box
                  sx={{
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 250px)",
                    px: 2,
                    py: 2
                  }}
                >
                  <Grid container spacing={2}>
                    {group.tasks.map((task: Task) => (
                      <Grid item key={task.id} xs={12} sm={6} md={4} lg={4} xl={3}>
                        <TaskItem
                          task={task}
                          onTaskClick={onTaskClick}
                          view={view}
                          getStatusColor={getStatusColor}
                          formatDate={formatDate}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            ) : null
          )
        )}
      </Box>
    </Box>
  );
};

export default ViewMoreList;

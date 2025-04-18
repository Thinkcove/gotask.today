import React from "react";
import { Box, Drawer, CircularProgress, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TaskItem from "./taskItem";
import { getStatusColor } from "@/app/common/constants/task";
import { formatDate } from "@/app/common/utils/common";
import { IGroup, ITask } from "../interface/taskInterface";

interface ViewMoreListProps {
  open: boolean;
  selectedGroupId: string;
  drawerTasks: IGroup[];
  isLoadingDrawer: boolean;
  onClose: () => void;
  onTaskClick: (id: string) => void;
  view: string;
}

const ViewMoreList: React.FC<ViewMoreListProps> = ({
  open,
  selectedGroupId,
  drawerTasks,
  isLoadingDrawer,
  onClose,
  onTaskClick,
  view
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={() => {}}>
      <Box sx={{ width: 550 }}>
        {isLoadingDrawer ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          drawerTasks.map((group: IGroup) =>
            group.id === selectedGroupId ? (
              <Box key={group.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    zIndex: 1100,
                    backgroundColor: "#741B92",
                    p: 2
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: "white" }}>
                    {view === "projects" ? group.project_name : group.user_name}
                  </Typography>
                  <IconButton onClick={onClose} sx={{ color: "white", p: 0 }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                {group.tasks.map((task: ITask) => (
                  <Box key={task.id} sx={{ px: 2, pt: 2 }}>
                    <TaskItem
                      key={task.id}
                      task={task}
                      onTaskClick={onTaskClick}
                      view={view}
                      getStatusColor={getStatusColor}
                      formatDate={formatDate}
                    />
                  </Box>
                ))}
              </Box>
            ) : null
          )
        )}
      </Box>
    </Drawer>
  );
};

export default ViewMoreList;

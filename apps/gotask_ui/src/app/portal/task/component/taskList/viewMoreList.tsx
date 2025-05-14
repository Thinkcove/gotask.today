import React from "react";
import { Box, Drawer, CircularProgress, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TaskItem, { Task } from "../taskLayout/taskItem";
import { getStatusColor } from "@/app/common/constants/task";
import { formatDate } from "@/app/common/utils/common";
import { IGroup } from "../../interface/taskInterface";

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
      <Box
        sx={{
          width: { xs: "100%", sm: "100%", md: "900px" },
          maxWidth: 450,
          display: "flex",
          flexDirection: "column",
          height: "100vh"
        }}
      >
        {isLoadingDrawer ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          drawerTasks.map((group: IGroup) =>
            group.id === selectedGroupId ? (
              <Box key={group.id} sx={{ flex: 1 }}>
                <Box
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 1100,
                    backgroundColor: "white",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: "#741B92" }}>
                    {view === "projects" ? group.project_name : group.user_name}
                  </Typography>
                  <IconButton onClick={onClose} sx={{ color: "black", p: 0 }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box sx={{ overflowY: "auto", maxHeight: "calc(100vh - 100px)" }}>
                  {group.tasks.map((task: Task) => (
                    <Box key={task.id} sx={{ px: 1 }}>
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
              </Box>
            ) : null
          )
        )}
      </Box>
    </Drawer>
  );
};

export default ViewMoreList;

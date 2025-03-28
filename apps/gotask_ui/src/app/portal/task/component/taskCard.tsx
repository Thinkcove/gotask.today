import React from "react";
import { Typography, Paper, Box, Divider } from "@mui/material";
import { getStatusColor } from "@/app/common/constants/task";
import { formatDate } from "@/app/common/utils/common";
import { ReadMoreTwoTone } from "@mui/icons-material";
import TaskItem from "./taskItem";
import { IGroup, ITask } from "../interface/taskInterface";

interface TaskCardProps {
  view: "projects" | "users";
  group: IGroup;
  onTaskClick: (id: string) => void;
  onViewMore: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ view, group, onTaskClick, onViewMore }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": { boxShadow: "0px 4px 10px rgba(156, 32, 240, 0.6)" },
        height: 360,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
          {view === "projects" ? group.project_name : group.user_name}
        </Typography>

        {group.tasks.length > 3 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover": { textDecoration: "underline" },
              cursor: "pointer"
            }}
            onClick={() => onViewMore(group.id)}
          >
            <Typography variant="subtitle1" sx={{ color: "#741B92" }} fontWeight="bold">
              View {group.tasks.length - 3} more
            </Typography>
            <ReadMoreTwoTone sx={{ color: "#741B92" }} />
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
        {group.tasks.length > 0 ? (
          <>
            {group.tasks.slice(0, 3).map((task: ITask) => (
              <TaskItem
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
                view={view}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
              />
            ))}
          </>
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

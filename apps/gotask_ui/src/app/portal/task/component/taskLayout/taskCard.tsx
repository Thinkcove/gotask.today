import React from "react";
import { Typography, Paper, Box, Divider } from "@mui/material";
import { getStatusColor } from "@/app/common/constants/task";
import { formatDate } from "@/app/common/utils/common";
import { ReadMoreTwoTone } from "@mui/icons-material";
import TaskItem, { Task } from "./taskItem";
import { IGroup } from "../../interface/taskInterface";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface TaskCardProps {
  view: "projects" | "users";
  group: IGroup;
  onTaskClick: (id: string) => void;
  onViewMore: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ view, group, onTaskClick, onViewMore }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  return (
    <Paper
      elevation={2}
      sx={{
        p: 1.5,
        borderRadius: 3,
        transition: "0.3s",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Box
        sx={{
          px: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(45deg, rgb(194, 158, 206), rgb(229, 223, 230))",
          borderRadius: "6px"
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
              {transtask("viewmore", { count: group.tasks.length - 3 })}
            </Typography>
            <ReadMoreTwoTone sx={{ color: "#741B92" }} />
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ flexGrow: 1, overflowY: "auto", minHeight: 400 }}>
        {group.tasks.length > 0 ? (
          <>
            {group.tasks.slice(0, 5).map((task: Task) => (
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
            {transtask("notask")}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default TaskCard;

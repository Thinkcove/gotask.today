import { Box, Typography, Tooltip } from "@mui/material";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import { getVariationColor } from "@/app/common/constants/task";
import { TuneRounded } from "@mui/icons-material";

interface Task {
  id: string;
  status: string;
  due_date: string;
  title: string;
  user_name: string;
  project_name: string;
  variation: string;
}

interface TaskItemProps {
  task: Task;
  onTaskClick: (id: string) => void;
  view: string;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onTaskClick,
  view,
  getStatusColor,
  formatDate
}) => {
  const { canAccess } = useUserPermission();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        borderRadius: 2,
        border: "1px solid rgba(0, 0, 0, 0.12)",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
        px: 2,
        py: 1.5,
        mb: 1.5,
        cursor: canAccess(APPLICATIONS.TASK, ACTIONS.VIEW) ? "pointer" : "default",
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)"
        }
      }}
      onClick={canAccess(APPLICATIONS.TASK, ACTIONS.VIEW) ? () => onTaskClick(task.id) : undefined}
    >
      {/* Left Section */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Task Title */}
        <Tooltip title={task.title} arrow>
          <Typography
            variant="subtitle2"
            sx={{
              textTransform: "capitalize",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 250,
              display: "block"
            }}
          >
            {task.title}
          </Typography>
        </Tooltip>

        {/* Variation Detail */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
          <TuneRounded sx={{ fontSize: 16, color: getVariationColor(task.variation) }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: getVariationColor(task.variation),
              textTransform: "capitalize"
            }}
          >
            Variation:{" "}
            {task.variation === "0d0h"
              ? "No variation"
              : task.variation.startsWith("-")
                ? task.variation
                : `+${task.variation}`}
          </Typography>
        </Box>

        {/* Metadata: Due Date + Status */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5 }}>
          {/* Due Date */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarMonth sx={{ fontSize: 16, color: "#888" }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(task.due_date)}
            </Typography>
          </Box>

          {/* Status */}
          <Box
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: 1,
              backgroundColor: getStatusColor(task.status),
              fontSize: "0.7rem",
              color: "#fff"
            }}
          >
            {task.status.replace(/-/g, " ").toUpperCase()}
          </Box>
        </Box>
      </Box>

      {/* Right Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          textAlign: "right"
        }}
      >
        {view === "projects" ? (
          <Tooltip title={task.user_name} arrow>
            <AlphabetAvatar userName={task.user_name} />
          </Tooltip>
        ) : (
          <Tooltip title={task.project_name} arrow>
            <Typography variant="caption" color="text.secondary">
              {task.project_name}
            </Typography>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default TaskItem;

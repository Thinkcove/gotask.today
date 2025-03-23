import { Box, Typography, Tooltip, Avatar } from "@mui/material";
import TimelineDot from "@mui/lab/TimelineDot";
import CalendarMonth from "@mui/icons-material/CalendarMonth";

interface Task {
  id: string;
  status: string;
  due_date: string;
  title: string;
  user_name: string;
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
  formatDate,
}) => {
  return (
    <Box
      key={task.id}
      sx={{
        gap: 1,
        mb: 1,
        backgroundColor: "white",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TimelineDot
          sx={{
            border: "1px solid white",
            backgroundColor: getStatusColor(task.status),
            margin: 0,
          }}
        >
          <CalendarMonth sx={{ height: 16, width: 16 }} />
        </TimelineDot>
        <Box>
          <Typography variant="subtitle2" fontWeight="semibold">
            {formatDate(task.due_date)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 3.5 }}>
        <Box
          sx={{
            height: 40,
            borderLeft: "2px solid grey",
            marginLeft: "13px",
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            backgroundColor: "#F9F9F9",
            transition:
              "background-color 0.3s ease-in-out, border-left-color 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: getStatusColor(task.status),
            },
            borderRadius: 2,
            cursor: "pointer",
            padding: 1,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => onTaskClick(task.id)}
        >
          <Typography variant="subtitle2">{task.title}</Typography>
          {view === "projects" && (
            <Tooltip title={task.user_name} arrow>
              <Avatar sx={{ height: 24, width: 24, fontSize: 12 }}>
                {task.user_name.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TaskItem;

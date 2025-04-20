import { Box, Typography, Tooltip, Avatar } from "@mui/material";
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
  formatDate
}) => {
  return (
    <Box
      key={task.id}
      sx={{
        mb: 1,
        p: 1,
        backgroundColor: "white",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            border: "1px solid white",
            backgroundColor: "#741B92",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CalendarMonth sx={{ height: 16, width: 16 }} />
        </Avatar>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%"
          }}
        >
          <Typography variant="subtitle2" fontWeight="semibold">
            {formatDate(task.due_date)}
          </Typography>
          <Typography sx={{ color: getStatusColor(task.status), fontSize: "0.7rem" }}>
            {task.status.replace(/-/g, " ").toUpperCase()}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            height: 40,
            borderLeft: "2px solid grey",
            marginLeft: "11px",
            mt: 0.5
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            backgroundColor: "#F9F9F9",
            borderRadius: 2,
            cursor: "pointer",
            padding: 1,
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
          }}
          onClick={() => onTaskClick(task.id)}
        >
          <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
            <Tooltip title={task.title} arrow>
              <Typography
                variant="subtitle2"
                sx={{
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 300,
                  display: "block"
                }}
              >
                {task.title}
              </Typography>
            </Tooltip>
            {/* <LinearProgress
              variant="determinate"
              value={getProgressValue(task.status)}
              sx={{
                height: 6,
                borderRadius: 3,
                mt: 1,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getStatusColor(task.status)
                }
              }}
            /> */}
          </Box>
          {view === "projects" && (
            <Box
              sx={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <Tooltip title={task.user_name} arrow>
                <Avatar sx={{ height: 24, width: 24, fontSize: 12 }}>
                  {task.user_name.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TaskItem;

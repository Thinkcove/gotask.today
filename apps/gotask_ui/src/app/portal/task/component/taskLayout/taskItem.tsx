import { Box, Typography, Tooltip, Avatar } from "@mui/material";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface Task {
  id: string;
  status: string;
  due_date: string;
  title: string;
  user_name: string;
  project_name: string;
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
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  return (
    <Box
      key={task.id}
      sx={{
        mb: 2,
        px: 1,
        pb: 1,
        pt: 1,
        backgroundColor: "white",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        border: "2px solid rgba(92, 89, 89, 0.1)",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            border: "1px solid white",
            backgroundColor: "#741B92",
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <CalendarMonth sx={{ height: 10, width: 10 }} />
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
           {transtask(`status.${task.status}`, {
              defaultValue: task.status.replace(/-/g, " ").toUpperCase(),
            })}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column"
            }}
          >
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
          </Box>
          {view === "projects" ? (
            <Box
              sx={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <Tooltip title={task.user_name} arrow>
                <AlphabetAvatar userName={task.user_name} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                width: "10%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
                pr: 2
              }}
            >
              <Tooltip title={task.project_name} arrow>
                <Typography>{task.project_name}</Typography>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TaskItem;

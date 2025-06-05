import { Box, Typography, Stack, Divider } from "@mui/material";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import { CalendarToday, Description, Person } from "@mui/icons-material";
import StatusIndicator from "@/app/component/status/statusIndicator";
import TimeBadge from "@/app/component/badge/timeBadge";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { getSeverityColor } from "@/app/common/constants/task";

export interface Task {
  id: string;
  status: string;
  due_date: string;
  title: string;
  user_name: string;
  project_name: string;
  variation: string;
  estimated_time: string;
  time_spent_total: string;
  remaining_time: string;
  severity: string;
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
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);

  return (
    <Box
      sx={{
        backgroundColor: `${getStatusColor(task.status)}12`,
        borderRadius: 2,
        border: `1px solid ${getStatusColor(task.status)}33`,
        px: 1,
        py: 2,
        mb: 2,
        cursor: canAccess(APPLICATIONS.TASK, ACTIONS.VIEW) ? "pointer" : "default",
        transition: "box-shadow 0.2s ease"
      }}
      onClick={canAccess(APPLICATIONS.TASK, ACTIONS.VIEW) ? () => onTaskClick(task.id) : undefined}
    >
      {/* Title and Status */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography
          variant="subtitle1"
          fontWeight={400}
          textTransform={"capitalize"}
          fontSize="1rem"
        >
          {task.title}
        </Typography>
        <StatusIndicator status={task.status} getColor={getStatusColor} />
      </Stack>

      {/* Info Row */}
      <Stack
        direction="row"
        gap={1.5}
        flexWrap="wrap"
        alignItems="center"
        divider={<Divider orientation="vertical" flexItem />}
        mb={1.5}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <CalendarToday sx={{ fontSize: 18, color: "text.secondary" }} />
          <Typography variant="body2">{formatDate(task.due_date)}</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          {view === "projects" ? (
            <Person sx={{ fontSize: 18, color: "text.secondary" }} />
          ) : (
            <Description sx={{ fontSize: 18, color: "text.secondary" }} />
          )}

          <Typography variant="body2">
            {view === "projects" ? task.user_name : task.project_name}
          </Typography>
        </Stack>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${getSeverityColor(task.severity)} 30%, #fff 100%)`,
              boxShadow: `0 0 6px ${getSeverityColor(task.severity)}`
            }}
          />
          <Box
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: getSeverityColor(task.severity),
              textTransform: "uppercase"
            }}
          >
            {task.severity}
          </Box>
        </Box>
      </Stack>

      {/* Time Info */}
      <Stack direction="row" gap={1.5} flexWrap="wrap">
        <TimeBadge label={transtask("estimatedt")} value={task.estimated_time ?? "-"} />
        <TimeBadge label={transtask("spentt")} value={task.time_spent_total ?? "-"} />
        <TimeBadge label={transtask("remainingt")} value={task.remaining_time ?? "-"} />
        <TimeBadge label={transtask("variationt")} value={task.variation ?? "—"} />
      </Stack>
    </Box>
  );
};

export default TaskItem;

import { Box, Typography, Tooltip, Stack, Chip } from "@mui/material";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import { getVariationColor } from "@/app/common/constants/task";
import { CalendarToday, Person, Tune, TuneRounded, WarningAmber, Work } from "@mui/icons-material";
import StatusIndicator from "@/app/component/status/statusIndicator";
import TimeBadge from "@/app/component/badge/timeBadge";
import LabeledInfoRow from "@/app/component/badge/labeledInfoRow";
import { ITask } from "../../interface/taskInterface";

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
const severityColor = {
  low: "success.main",
  medium: "warning.main",
  high: "error.main",
  critical: "error.dark" // or any distinct color you prefer
} as const;
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onTaskClick,
  view,
  getStatusColor,
  formatDate
}) => {
  const { canAccess } = useUserPermission();
  const allowedSeverities = Object.keys(severityColor);
  const safeSeverity = (
    allowedSeverities.includes(task.severity) ? task.severity : "low"
  ) as keyof typeof severityColor;

  const rawVariation = (task as Task).variation;
  const variationStr = typeof rawVariation === "string" ? rawVariation : "0d0h";
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
        px: 1,
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
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={400} textTransform={"capitalize"} fontSize="1rem">
            {task.title}
          </Typography>

          <StatusIndicator status={task.status} getColor={getStatusColor} />
        </Stack>
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
            Variation: {task.variation ? task.variation : "0d0h"}
          </Typography>
        </Box>

        <Stack spacing={1.5} mb={2}>
          <LabeledInfoRow
            icon={<CalendarToday />}
            label="Due Date"
            value={formatDate(task.due_date)}
          />
          <LabeledInfoRow
            icon={<Tune sx={{ color: getVariationColor(variationStr) }} />}
            label="Variation"
            value={variationStr}
          />

          <LabeledInfoRow
            icon={view === "projects" ? <Person /> : <Work />}
            label={view === "projects" ? "Assignee" : "Project"}
            value={view === "projects" ? task.user_name : task.project_name}
          />
          <LabeledInfoRow
            icon={<WarningAmber sx={{ color: severityColor[safeSeverity] }} />}
            label="Severity"
            value={task.severity?.toUpperCase() ?? "N/A"}
          />
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {view !== "projects" && (
            <>
              <TimeBadge label="Estimated" value={task.estimated_time ?? "0d0h"} />
              <TimeBadge label="Spent" value={task.time_spent_total ?? "0d0h"} />
              <TimeBadge label="Remaining" value={task.remaining_time ?? "0d0h"} />
            </>
          )}

          {view === "projects" && <TimeBadge label="Variation" value={task.variation ?? "—"} />}
        </Stack>
      </Box>
    </Box>
  );
};

export default TaskItem;

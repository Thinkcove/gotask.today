import React from "react";
import { Box, Typography, Paper, Stack, Divider, Chip } from "@mui/material";
import { CalendarToday, AccessTime, Person, Work, WarningAmber, Tune } from "@mui/icons-material";
import { formatDate } from "@/app/common/utils/common";
import { getStatusColor, getVariationColor } from "@/app/common/constants/task";
import { ITask } from "../../interface/taskInterface";

interface Props {
  task: ITask;
  view: "projects" | "users";
  onClick: () => void;
}

const severityColor = {
  low: "success.main",
  medium: "warning.main",
  high: "error.main",
  critical: "error.dark" // or any distinct color you prefer
} as const;

const TaskCard: React.FC<Props> = ({ task, view, onClick }) => {
  const allowedSeverities = Object.keys(severityColor);
  const safeSeverity = (
    allowedSeverities.includes(task.severity) ? task.severity : "low"
  ) as keyof typeof severityColor;

  const rawVariation = (task as ITask).variation;
  const variationStr = typeof rawVariation === "string" ? rawVariation : "0d0h";
  return (
    <Paper
      onClick={onClick}
      elevation={2}
      sx={{
        borderRadius: 3,
        p: 3,
        cursor: "pointer",
        "&:hover": { backgroundColor: "#f9f9f9" },
        maxWidth: 700,
        mb: 3
      }}
    >
      {/* Title + Status */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" fontWeight={600} textTransform={"capitalize"}>
          {task.title}
        </Typography>
        <Chip
          size="small"
          label={task.status.replace(/-/g, " ").toUpperCase()}
          sx={{
            backgroundColor: getStatusColor(task.status),
            color: "#fff",
            fontWeight: 600
          }}
        />
      </Stack>

      {/* Info Grid */}
      <Stack spacing={1.5} mb={2}>
        <InfoRow icon={<CalendarToday />} label="Due Date" value={formatDate(task.due_date)} />
        <InfoRow
          icon={<Tune sx={{ color: getVariationColor(variationStr) }} />}
          label="Variation"
          value={variationStr}
        />

        <InfoRow
          icon={view === "projects" ? <Person /> : <Work />}
          label={view === "projects" ? "Assignee" : "Project"}
          value={view === "projects" ? task.user_name : task.project_name}
        />
        <InfoRow
          icon={<WarningAmber sx={{ color: severityColor[safeSeverity] }} />}
          label="Severity"
          value={task.severity?.toUpperCase() ?? "N/A"}
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Time Details */}
      <Stack direction="row" flexWrap="wrap" gap={2}>
        <TimeBadge label="Estimated" value={task.estimated_time ?? "—"} />
        <TimeBadge label="Spent" value={task.time_spent_total ?? "—"} />
        <TimeBadge label="Remaining" value={task.remaining_time ?? "—"} />
      </Stack>

      {/* Footer: Created / Updated */}
      <Typography variant="caption" color="text.secondary" mt={3} display="block">
        Created: {formatDate(task.created_on)} | Updated: {formatDate(task.updated_on)}
      </Typography>
    </Paper>
  );
};

const InfoRow = ({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box color="text.secondary">{icon}</Box>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 90 }}>
      {label}:
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Stack>
);

const TimeBadge = ({ label, value }: { label: string; value: string }) => (
  <Chip
    icon={<AccessTime fontSize="small" />}
    label={`${label}: ${value}`}
    variant="outlined"
    sx={{ borderRadius: 1 }}
  />
);

export default TaskCard;

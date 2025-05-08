import { Box, Typography, Grid, IconButton, Divider, Chip } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { getStatusColor, TASK_SEVERITY } from "@/app/common/constants/task";
import LabelValueText from "@/app/component/text/labelValueText";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { ITask } from "../../interface/taskInterface";
import { useRouter } from "next/navigation";
import { userPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import StatusIndicator from "@/app/component/status/statusIndicator";

interface TaskDetailViewProps {
  task: ITask;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case TASK_SEVERITY.HIGH:
        return "error";
      case TASK_SEVERITY.MEDIUM:
        return "warning";
      case TASK_SEVERITY.LOW:
        return "success";
      default:
        return "default";
    }
  };
  const router = useRouter();

  const handleBack = () => {
    setTimeout(() => router.back(), 2000);
  };
  const { canAccess } = userPermission();
  return (
    <>
      <ModuleHeader name={transtask("tasks")} />
      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            p: 4,
            bgcolor: "#f9fafb",
            border: "1px solid #e0e0e0"
          }}
        >
          {/* Header */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Box>
                <Typography variant="h5" fontWeight={500} sx={{ textTransform: "capitalize" }}>
                  {task?.title}
                </Typography>
                <StatusIndicator status={task.status} getColor={getStatusColor} />
              </Box>
              {canAccess(APPLICATIONS.TASK, ACTIONS.UPDATE) && (
                <IconButton
                  edge="start"
                  color="primary"
                  onClick={() => router.push(`/portal/task/editTask/${task.id}`)}
                >
                  <Edit />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Task Description */}
          <Grid container spacing={2} flexDirection="column" mb={3}>
            <Grid item xs={4}>
              <LabelValueText
                label={transtask("labeldescription")}
                value={task.description || "-"}
              />
            </Grid>
          </Grid>

          {/* Meta Info */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText label={transtask("labelassignee")} value={task.user_name} />
            </Grid>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText label={transtask("labelproject")} value={task.project_name} />
            </Grid>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText
                label={transtask("labelseverity")}
                value={task.severity.toUpperCase()}
                sx={{ color: getSeverityColor(task.severity) }}
              />
            </Grid>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText
                label={transtask("labelcreateon")}
                value={new Date(task.created_on).toLocaleDateString()}
              />
            </Grid>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText
                label={transtask("labelduedate")}
                value={new Date(task.due_date).toLocaleDateString()}
              />
            </Grid>
          </Grid>

          <Divider sx={{ mt: 2 }} />
        </Box>
      </Box>
    </>
  );
};

export default TaskDetailView;

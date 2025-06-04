import { Box, Typography, Grid, IconButton, Divider, CircularProgress } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { getSeverityColor, getStatusColor } from "@/app/common/constants/task";
import LabelValueText from "@/app/component/text/labelValueText";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { ITask } from "../../interface/taskInterface";
import { useRouter } from "next/navigation";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import StatusIndicator from "@/app/component/status/statusIndicator";
import CommentHistory from "../../editTask/commentsHistory";
import { formatTimeValue } from "@/app/common/utils/common";

interface TaskDetailViewProps {
  task: ITask;
  loading?: boolean;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, loading = false }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const router = useRouter();
  const { canAccess } = useUserPermission();

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (loading || !task || Object.keys(task).length === 0) {
    return (
      <>
        <ModuleHeader name={transtask("tasks")} />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              textAlign: "center"
            }}
          >
            <CircularProgress size={50} thickness={4} />
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <ModuleHeader name={transtask("tasks")} />
      <Box
        sx={{
          minHeight: "100vh",
          p: { xs: 1, sm: 2, md: 3 },
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
            bgcolor: "#f9fafb",
            border: "1px solid #e0e0e0",
            maxHeight: { xs: "auto", md: 820 }, // Remove max height on mobile
            width: "100%", // Ensure full width
            boxSizing: "border-box", // Include padding in width calculation
            overflow: "hidden" // Prevent content from breaking out
          }}
        >
          {/* Header */}
          <Grid container spacing={2} alignItems="center" mb={3}>
            {/* Back Button */}
            <Grid item xs="auto">
              <IconButton color="primary" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
            </Grid>

            {/* Task Title and Status */}
            <Grid item xs>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={500}
                  sx={{
                    textTransform: "capitalize",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" } // Responsive font size
                  }}
                >
                  {task?.title}
                </Typography>
                <StatusIndicator status={task.status} getColor={getStatusColor} />
              </Box>
            </Grid>

            {/* Edit Button - Separate Grid */}
            {canAccess(APPLICATIONS.TASK, ACTIONS.UPDATE) && (
              <Grid item xs="auto">
                <IconButton
                  color="primary"
                  onClick={() => router.push(`/task/editTask/${task.id}`)}
                >
                  <Edit />
                </IconButton>
              </Grid>
            )}
          </Grid>

          {/* Task Description - Modified to display on separate lines */}
          <Box sx={{ flex: 1, maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}>
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                {transtask("detaildesc")}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap", // Preserve line breaks
                  wordBreak: "break-word" // Break long words if needed
                }}
              >
                {task.description || "-"}
              </Typography>
            </Box>

            {/* Meta Info */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText label={transtask("detailuser")} value={task.user_name || "-"} />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("detailproject")}
                  value={task.project_name || "-"}
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("detailseverity")}
                  value={task.severity || "-"}
                  sx={{ color: getSeverityColor(task.severity), textTransform: "capitalize" }}
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("detailcreated")}
                  value={new Date(task.created_on).toLocaleDateString()}
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("detaildue")}
                  value={new Date(task.due_date).toLocaleDateString()}
                />
              </Grid>

              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("estimatedt")}
                  value={formatTimeValue(task.estimated_time || "-")}
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("spentt")}
                  value={formatTimeValue(task.time_spent_total || "-")}
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("remainingt")}
                  value={formatTimeValue(task.remaining_time || "-")}
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("variationt")}
                  value={formatTimeValue(task.variation || "-")}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mt: 2, mb: 2 }} />

            {/* Comment History - Contained within card */}
            {Array.isArray(task?.comment) && task.comment.length > 0 && (
              <Box
                sx={{
                  width: "100%",
                  boxSizing: "border-box",
                  overflow: "hidden", // Prevent horizontal overflow
                  wordBreak: "break-word" // Break long words if needed
                }}
              >
                <CommentHistory comments={task.comment} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TaskDetailView;

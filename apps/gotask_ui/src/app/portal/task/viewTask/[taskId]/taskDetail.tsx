import { Box, Typography, Grid, IconButton, Divider } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { getSeverityColor, getStatusColor } from "@/app/common/constants/task";
import LabelValueText from "@/app/component/text/labelValueText";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { ITask } from "../../interface/taskInterface";
import { useRouter } from "next/navigation";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import StatusIndicator from "@/app/component/status/statusIndicator";
import CommentHistory from "../../editTask/commentsHistory";

type Comment = {
  id: string;
  user_name: string;
  comment: string;
  createdAt?: string;
};

interface TaskDetailViewProps {
  task: ITask;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const router = useRouter();
  const { canAccess } = useUserPermission();

  const handleBack = () => {
    setTimeout(() => router.back(), 2000);
  };

  return (
    <>
      <ModuleHeader name={transtask("tasks")} />
      <Box
        sx={{
          minHeight: "100vh",
          p: { xs: 1, sm: 2, md: 3 }, // Responsive padding
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
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                flexDirection: { xs: "column", sm: "row" }, // Stack on mobile
                alignItems: { xs: "flex-start", sm: "center" }
              }}
            >
              <Box sx={{ mb: { xs: 1, sm: 0 } }}>
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
              {canAccess(APPLICATIONS.TASK, ACTIONS.UPDATE) && (
                <IconButton
                  edge="start"
                  color="primary"
                  onClick={() => router.push(`/portal/task/editTask/${task.id}`)}
                  sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
                >
                  <Edit />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Task Description */}
          <Grid container spacing={2} flexDirection="column" mb={3}>
            <Grid item xs={12}>
              <LabelValueText label={transtask("detaildesc")} value={task.description || "-"} />
            </Grid>
          </Grid>

          {/* Meta Info */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText label={transtask("detailuser")} value={task.user_name} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText label={transtask("detailproject")} value={task.project_name} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText
                label={transtask("detailseverity")}
                value={task.severity}
                sx={{ color: getSeverityColor(task.severity), textTransform: "capitalize" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText
                label={transtask("detailcreated")}
                value={new Date(task.created_on).toLocaleDateString()}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LabelValueText
                label={transtask("detaildue")}
                value={new Date(task.due_date).toLocaleDateString()}
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
    </>
  );
};

export default TaskDetailView;

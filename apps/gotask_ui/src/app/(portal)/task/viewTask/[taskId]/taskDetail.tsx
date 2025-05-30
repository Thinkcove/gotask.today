import { Box, Typography, Grid, IconButton, Divider, CircularProgress } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { getSeverityColor, getStatusColor } from "@/app/common/constants/task";
import LabelValueText from "@/app/component/text/labelValueText";
import ModuleHeader from "@/app/component/appBar/moduleHeader";
import { ITask, ITaskComment } from "../../interface/taskInterface";
import { useRouter } from "next/navigation";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/authCheck";
import StatusIndicator from "@/app/component/status/statusIndicator";
import TaskComments from "../../editTask/taskComments";
import { formatTimeValue } from "@/app/common/utils/common";
import { useState } from "react";
import { useUser } from "@/app/userContext";
import { createComment } from "@/app/(portal)/task/service/taskAction";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { KeyedMutator } from "swr";
import CommentHistory from "../../editTask/commentsHistory";

interface TaskDetailViewProps {
  task: ITask;
  loading?: boolean;
  mutate?: KeyedMutator<ITask>;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ task, loading = false, mutate }) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const router = useRouter();
  const { canAccess } = useUserPermission();
  const { user } = useUser(); // Get logged-in user details
  const [isCommenting, setIsCommenting] = useState(false); // Control TaskComments visibility
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const handleBack = () => {
    router.back();
  };

  // Handle comment save
  const handleSaveComment = async (comment: string) => {
    if (!comment.trim()) return;

    try {
      const commentData: ITaskComment = {
        task_id: task.id,
        user_id: user?.id || "",
        user_name: user?.name || "",
        comment
      };
      await createComment(commentData);
      setSnackbar({
        open: true,
        message: transtask("commentsuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      setIsCommenting(false); // Hide TaskComments after saving
      if (mutate) await mutate(); // Refresh task data
    } catch (error) {
      console.error("Error saving comment:", error);
      setSnackbar({
        open: true,
        message: transtask("commenterror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
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
          background: "linear"
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            p: { xs: 2, sm: 3, md: 4 },
            bgcolor: "#f9fafb",
            border: "1px solid #e0e0e0",
            maxHeight: { xs: "auto", md: "0" },
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden"
          }}
        >
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs="auto">
              <IconButton color="primary" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
            </Grid>

            <Grid item xs>
              <Box>
                <Typography
                  variant="h5"
                  fontWeight={500}
                  sx={{
                    textTransform: "capitalize",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" }
                  }}
                >
                  {task?.title}
                </Typography>
                <StatusIndicator status={task.status} getColor={getStatusColor} />
              </Box>
            </Grid>

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

          <Box mb={3}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                mb: 1
              }}
            >
              {transtask("detaildesc")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.primary",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word"
              }}
            >
              {task.description || "-"}
            </Typography>
          </Box>

          <Grid container spacing={2} mb={3}>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText label={transtask("detailuser")} value={task.user_name || "-"} />
            </Grid>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText label={transtask("detailproject")} value={task.project_name || "-"} />
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

          <Box
            sx={{
              width: "100%",
              boxSizing: "border-box",
              overflow: "hidden",
              wordBreak: "break-word"
            }}
          >
            {isCommenting && (
              <TaskComments comments={task.comment || []} onSave={handleSaveComment} />
            )}

            {!isCommenting && Array.isArray(task?.comment) && task.comment.length > 0 && (
              <CommentHistory
                comments={task.comment}
                onEdit={() => setIsCommenting(true)}
                canEditId={user?.id || ""}
              />
            )}
          </Box>

          <CustomSnackbar
            open={snackbar.open}
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          />
        </Box>
      </Box>
    </>
  );
};

export default TaskDetailView;


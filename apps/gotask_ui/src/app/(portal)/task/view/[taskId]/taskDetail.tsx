import React, { useState } from "react";
import { Box, Typography, Grid, IconButton, Divider, CircularProgress } from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { getSeverityColor, getStatusColor } from "@/app/common/constants/task";
import LabelValueText from "@/app/component/text/labelValueText";
import ModuleHeader from "@/app/component/header/moduleHeader";
import { useRouter } from "next/navigation";
import { useUserPermission } from "@/app/common/utils/userPermission";
import { ACTIONS, APPLICATIONS } from "@/app/common/utils/permission";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { formatTimeValue } from "@/app/common/utils/taskTime";
import { createComment, deleteComment, updateComment } from "../../service/taskAction";
import { useUser } from "@/app/userContext";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import CommentSection from "../../../../component/comments/commentSection";
import { RichTextReadOnly } from "mui-tiptap";
import { getTipTapExtensions } from "@/app/common/utils/textEditor";
import TimeProgressBar from "../timeProgressBar";
import TimeSpentPopup from "../timeSpentPopup";

interface TaskDetailViewProps {
  task: any;
  storyName?: string; // Story name passed from parent
  loading?: boolean;
  mutate: () => Promise<void>;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({
  task,
  storyName = "-", // Default value
  loading = false,
  mutate
}) => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  const { user } = useUser();
  const router = useRouter();
  const { canAccess } = useUserPermission();

  const handleBack = () => router.back();

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const alreadyExists = task?.time_spent?.some(
    (entry: any) => entry.date === new Date().toISOString().split("T")[0]
  );

  const handleProgressClick = () => {
    if (!alreadyExists) setIsPopupOpen(true);
  };

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
          <CircularProgress size={50} thickness={4} />
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
            p: { xs: 2, sm: 3, md: 4 },
            bgcolor: "#f9fafb",
            border: "1px solid #e0e0e0",
            width: "100%",
            height: "calc(100vh - 120px)",
            overflowY: "auto",
            boxSizing: "border-box"
          }}
        >
          {/* Header */}
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs="auto">
              <IconButton color="primary" onClick={handleBack}>
                <ArrowBack />
              </IconButton>
            </Grid>

            <Grid item xs>
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
            </Grid>

            {canAccess(APPLICATIONS.TASK, ACTIONS.UPDATE) && (
              <Grid item xs="auto">
                <IconButton color="primary" onClick={() => router.push(`/task/edit/${task.id}`)}>
                  <Edit />
                </IconButton>
              </Grid>
            )}
          </Grid>

          {/* Progress Bar Centered between Title and Description */}
          {task.status !== "to-do" && (
            <Box mb={3} display="flex" justifyContent="center" width="100%">
              <Box maxWidth={600} width="100%">
                <TimeProgressBar
                  estimatedTime={task.estimated_time || "0h0m"}
                  timeSpentTotal={task.time_spent_total || "0h0m"}
                  dueDate={task.user_estimated || "0d0h0m"}
                  startDate={task.start_date || ""}
                  timeEntries={task.time_spent || []}
                  canLogTime={!alreadyExists}
                  variation={task.variation ? String(task.variation) : "0d0h0m"}
                  onClick={handleProgressClick}
                />
              </Box>
            </Box>
          )}

          {/* Content */}
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {/* Description */}
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                {transtask("detaildesc")}
              </Typography>

              <RichTextReadOnly
                content={task.description || ""}
                extensions={getTipTapExtensions()}
              />
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
                  label={transtask("labelprojectstories")}
                  value={storyName || "-"}
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("detailcreatedby")}
                  value={task.created_by_name || "-"}
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
                  value={task.created_on ? <FormattedDateTime date={task.created_on} /> : "-"}
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("detaildue")}
                  value={task.due_date ? <FormattedDateTime date={task.due_date} /> : "-"}
                />
              </Grid>
              <Grid item xs={4} sm={6} md={4}>
                <LabelValueText
                  label={transtask("startdate")}
                  value={task.start_date ? <FormattedDateTime date={task.start_date} /> : "-"}
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
                  value={formatTimeValue(task.variation || "-", true)}
                />
                {task.variation && task.variation !== "0d0h" && task.variation !== "0d0h0m" ? (
                  task.variation.startsWith("-") ? (
                    <Typography variant="caption" color="success.main">
                      {transtask("variation")}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="error">
                      {transtask("variationalert")}
                    </Typography>
                  )
                ) : null}
              </Grid>
            </Grid>

            <TimeSpentPopup
              isOpen={isPopupOpen}
              onClose={() => setIsPopupOpen(false)}
              originalEstimate={task.estimated_time || "0d0h0m"}
              taskId={task.id}
              dueDate={task.due_date || ""}
              mutate={async () => {
                await mutate();
                return undefined;
              }}
            />

            <Divider sx={{ mt: 2, mb: 2 }} />

            {/* Comments */}
            <CommentSection
              comments={task.comment}
              onSave={async (html) => {
                const commentData = {
                  task_id: task?.id,
                  user_id: user?.id || "",
                  user_name: user?.name || "",
                  comment: html
                };
                await createComment(commentData);
                await mutate();
              }}
              onUpdate={async (comment) => {
                const updatedComment = {
                  ...comment,
                  task_id: task.id
                };
                await updateComment(updatedComment);
                await mutate();
              }}
              onDelete={async (id) => {
                await deleteComment(id);
                await mutate();
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TaskDetailView;
"use client";

import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Button
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { useTranslations } from "next-intl";

import {
  getProjectStoryById,
  deleteProjectStory,
  getTasksByStory
} from "@/app/(portal)/projectStory/services/projectStoryActions";

import CustomSnackbar from "@/app/component/snackBar/snackbar";
import CommonDialog from "@/app/component/dialog/commonDialog";
import TaskItem from "../../task/component/taskLayout/taskItem";
import { getStatusColor } from "@/app/common/constants/task";
import { LOCALIZATION } from "@/app/common/constants/localization";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";
import LabelValueText from "@/app/component/text/labelValueText";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { STORY_STATUS_COLOR, StoryStatus } from "@/app/common/constants/storyStatus";
import EllipsisText from "../../../component/text/ellipsisText";

const ProjectStoryDetail = () => {
  const { storyId, projectId } = useParams();
  const router = useRouter();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const { data: story, isLoading } = useSWR(storyId ? ["projectStory", storyId] : null, () =>
    getProjectStoryById(storyId as string).then((res) => res?.data)
  );

  const { data: tasks, isLoading: isTasksLoading } = useSWR(
    storyId ? ["tasksByStory", storyId] : null,
    () => getTasksByStory(storyId as string).then((res) => res?.data)
  );

  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteProjectStory(storyId as string);
      const message = response?.message || t("Stories.success.deleted");

      setSnackbar({ open: true, message, severity: "success" });

      setTimeout(() => router.push(`/project/viewProject/${projectId}/stories`), 500);
    } catch (error) {
      console.error("Failed to delete story:", error);
      setSnackbar({ open: true, message: t("Stories.errors.deleteFailed"), severity: "error" });
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/task/viewTask/${taskId}`);
  };

  if (isLoading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!story) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>{t("Stories.errors.notFound")}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "87vh",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        overflow: "hidden"
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box display="flex" alignItems="flex-start" gap={1}>
          <Tooltip title={t("Stories.backToStories")}>
            <IconButton
              onClick={() => router.push(`/project/viewProject/${projectId}/stories`)}
              color="primary"
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>

          <Box>
            <Typography variant="h5" fontWeight={600} textTransform="capitalize">
              {story.title}
            </Typography>
            <StatusIndicator
              status={story.status}
              getColor={(s) => STORY_STATUS_COLOR[s as StoryStatus]}
            />
          </Box>
        </Box>

        {/* Right Section: Edit/Delete buttons */}
        <Box display="flex" gap={1}>
          <Tooltip title={t("Stories.editStory")}>
            <IconButton
              onClick={() =>
                router.push(`/project/viewProject/${projectId}/stories/edit/${storyId}`)
              }
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("Stories.deleteStory")}>
            <IconButton
              onClick={() => setOpenDeleteDialog(true)}
              color="error"
              disabled={isDeleting}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
            {t("Stories.descriptionLabel")}
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ whiteSpace: "pre-line" }}>
            {story.description || t("Stories.noDescription")}
          </Typography>
        </Box>

        <LabelValueText
          label={t("Stories.createdAt")}
          value={<FormattedDateTime date={story.createdAt} />}
        />
        <Divider sx={{ my: 3 }} />

        {/* Tasks Section */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              {t("Stories.taskSectionTitle")}
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#741B92", textTransform: "none", borderRadius: 2 }}
              onClick={() => router.push(`/task/createTask?storyId=${storyId}`)}
            >
              {t("Stories.createTask")}
            </Button>
          </Box>

          {isTasksLoading ? (
            <CircularProgress size={24} />
          ) : tasks?.length > 0 ? (
            <Box sx={{ flexGrow: 1 }}>
              <Box
                display="grid"
                gridTemplateColumns={{
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)"
                }}
                gap={2}
              >
                {tasks.map((task: any) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onTaskClick={handleTaskClick}
                    view="stories"
                    getStatusColor={getStatusColor}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("Stories.noTasks")}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Delete Dialog */}
      <CommonDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSubmit={handleDelete}
        title={t("Stories.deleteStory")}
        submitLabel={t("Stories.delete")}
      >
        <Typography variant="body1" color="text.secondary">
          {t("Stories.confirmDelete")}
        </Typography>
      </CommonDialog>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity as any}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default ProjectStoryDetail;

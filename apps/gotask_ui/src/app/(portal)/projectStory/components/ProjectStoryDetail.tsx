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
  getTasksByStory,
  addCommentToProjectStory,
  updateCommentOnProjectStory,
  deleteCommentFromProjectStory
} from "@/app/(portal)/projectStory/services/projectStoryActions";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import CommonDialog from "@/app/component/dialog/commonDialog";
import TaskItem from "../../task/component/taskLayout/taskItem";
import { getStatusColor } from "@/app/common/constants/task";
import { LOCALIZATION } from "@/app/common/constants/localization";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { STORY_STATUS_COLOR, StoryStatus } from "@/app/common/constants/storyStatus";
import CommentSection from "@/app/component/comments/commentSection";
import { RichTextReadOnly } from "mui-tiptap";
import { getTipTapExtensions } from "@/app/common/utils/textEditor";
import CommonTabs from "@/app/component/tabs/commonTabs";

const ProjectStoryDetail = () => {
  const { storyId, projectId } = useParams();
  const router = useRouter();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const [tabIndex, setTabIndex] = React.useState(0);

  const tabs = [
    { label: t("Stories.taskSectionTitle"), value: 0 },
    { label: t("Stories.commentSectionTitle"), value: 1 }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  const {
    data: story,
    isLoading,
    mutate
  } = useSWR(storyId ? ["projectStory", storyId] : null, () =>
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

      setTimeout(() => router.push(`/project/view/${projectId}/stories`), 500);
    } catch (error) {
      console.error("Failed to delete story:", error);
      setSnackbar({ open: true, message: t("Stories.errors.deleteFailed"), severity: "error" });
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/task/view/${taskId}`);
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
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 3,
        height: "calc(100vh - 100px)",
        overflow: "hidden"
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box display="flex" alignItems="flex-start" gap={1}>
          <Tooltip title={t("Stories.backToStories")}>
            <IconButton
              onClick={() => router.push(`/project/view/${projectId}/stories`)}
              color="primary"
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography
              variant="h5"
              fontWeight={600}
              sx={{
                textTransform: "capitalize",
                whiteSpace: "normal",
                wordBreak: "break-word"
              }}
            >
              {story.title}
            </Typography>
            <StatusIndicator
              status={story.status}
              getColor={(s) => STORY_STATUS_COLOR[s as StoryStatus]}
            />
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title={t("Stories.editStory")}>
            <IconButton
              onClick={() => router.push(`/project/view/${projectId}/stories/edit/${storyId}`)}
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

          {story.description ? (
            <RichTextReadOnly content={story.description} extensions={getTipTapExtensions()} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("Stories.noDescription")}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <CommonTabs tabIndex={tabIndex} onChange={handleTabChange} tabs={tabs} centered={false} />

        <Box mt={2}>
          {tabIndex === 0 && (
            <Box>
              <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
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
          )}
          {tabIndex === 1 && (
            <CommentSection
              comments={story.comments || []}
              onSave={async (html) => {
                await addCommentToProjectStory(storyId as string, { comment: html });
                await mutate();
              }}
              onUpdate={async (comment) => {
                await updateCommentOnProjectStory(comment.id, { comment: comment.comment });
                await mutate();
              }}
              onDelete={async (id) => {
                await deleteCommentFromProjectStory(id);
                await mutate();
              }}
            />
          )}
        </Box>
      </Box>

      {/* Dialogs */}
      <CommonDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onSubmit={handleDelete}
        title={t("Stories.deleteStory")}
        submitLabel={t("Stories.delete")}
        submitColor="#b71c1c"
      >
        <Typography variant="body1" color="text.secondary">
          {t("Stories.confirmDelete")}
        </Typography>
      </CommonDialog>

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

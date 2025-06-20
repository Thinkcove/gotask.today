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
  deleteProjectStory
} from "@/app/(portal)/projectStory/services/projectStoryService";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import CommonDialog from "@/app/component/dialog/commonDialog";
import { LOCALIZATION } from "@/app/common/constants/localization";

const ProjectStoryDetail = () => {
  const { storyId, projectId } = useParams();
  const router = useRouter();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS); // "Projects"

  const { data: story, isLoading } = useSWR(storyId ? ["projectStory", storyId] : null, () =>
    getProjectStoryById(storyId as string).then((res) => res?.data)
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
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title={t("Stories.backToStories")}>
            <IconButton
              onClick={() => router.push(`/project/viewProject/${projectId}/stories`)}
              color="primary"
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h5" fontWeight={600} color="#741B92">
            {story.title}
          </Typography>
        </Box>

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

      {/* Description Section */}
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        <Typography variant="body1" mb={2}>
          {story.description || t("Stories.noDescription")}
        </Typography>

        <Typography variant="caption" color="primary" display="block" mb={2}>
          {t("Stories.status")}: {story.status || t("Stories.na")}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Task Section */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              {t("Stories.taskSectionTitle")}
            </Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#741B92", textTransform: "none", borderRadius: 2 }}
              onClick={() => router.push(`/task/create?storyId=${storyId}`)}
            >
              {t("Stories.createTask")}
            </Button>
          </Box>

          {/* Placeholder */}
          <Typography variant="body2" color="text.secondary">
            {t("Stories.noTasks")}
          </Typography>
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

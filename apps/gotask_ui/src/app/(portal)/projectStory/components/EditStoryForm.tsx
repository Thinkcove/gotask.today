"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { getProjectStoryById, updateProjectStory } from "../services/projectStoryService";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useSWR from "swr";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import {
  STORY_STATUS,
  STORY_STATUS_OPTIONS,
  StoryStatus
} from "@/app/common/constants/storyStatus";

const EditStoryForm: React.FC = () => {
  const { storyId, projectId } = useParams();
  const router = useRouter();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<StoryStatus>(STORY_STATUS.TO_DO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const handleCloseSnackbar = () => setSnackOpen(false);

  const { data: story, isLoading } = useSWR(
    storyId ? [`projectStory`, storyId] : null,
    async () => {
      const resp = await getProjectStoryById(storyId as string);
      return resp?.data;
    },
    {
      onSuccess: (data) => {
        setTitle(data?.title ?? "");
        setDescription(data?.description ?? "");
        setStatus((data?.status as StoryStatus) ?? STORY_STATUS.TO_DO);
      },
      onError: () => {
        setSnackMessage(t("Stories.errors.loadFailed"));
        setSnackSeverity("error");
        setSnackOpen(true);
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(true);
      setSnackMessage(t("Stories.errors.titleRequired"));
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProjectStory(storyId as string, { title, description, status });
      setSnackMessage(t("Stories.success.updated"));
      setSnackSeverity("success");
      setSnackOpen(true);
      setTimeout(() => {
        router.push(`/project/viewProject/${projectId}/stories/${storyId}`);
      }, 800);
    } catch (err) {
      console.error(err);
      setSnackMessage(t("Stories.errors.updateFailed"));
      setSnackSeverity("error");
      setSnackOpen(true);
    } finally {
      setIsSubmitting(false);
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
        <Typography color="error">{t("Stories.errors.notFound")}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        margin: "0 auto",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      {/* Sticky Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          px: 2,
          py: 2,
          zIndex: 1000,
          bgcolor: "#fff"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={t("Stories.backToStoryDetails")}>
              <IconButton
                onClick={() => router.push(`/project/viewProject/${projectId}/stories/${storyId}`)}
                color="primary"
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
              {t("Stories.editStory")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push(`/project/viewProject/${projectId}/stories/${storyId}`)}
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid  #741B92",
                px: 2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)"
                }
              }}
            >
              {t("Stories.cancel")}
            </Button>

            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                borderRadius: "30px",
                backgroundColor: "#741B92",
                color: "white",
                px: 2,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "rgb(202, 187, 201)"
                }
              }}
            >
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : t("Stories.update")}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Form Content */}
      <Box
        sx={{
          px: 2,
          pb: 2,
          maxHeight: "calc(100vh - 150px)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3
        }}
      >
        <FormField
          label={t("Stories.title")}
          type="text"
          required
          value={title}
          onChange={(val) => {
            setTitle(val as string);
            setTitleError(false);
          }}
          error={titleError ? t("Stories.errors.titleRequired") : ""}
        />

        <FormField
          label={t("Stories.description")}
          type="text"
          placeholder={t("Stories.placeholders.descriptionUpdate")}
          multiline
          height={180}
          value={description}
          onChange={(val) => setDescription(val as string)}
        />

        <FormField
          label={t("Stories.status")}
          type="select"
          options={STORY_STATUS_OPTIONS}
          value={status}
          onChange={(val) => setStatus(val as StoryStatus)}
        />
      </Box>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackOpen}
        message={snackMessage}
        severity={snackSeverity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default EditStoryForm;

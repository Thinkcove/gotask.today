"use client";

import React, { useState } from "react";
import { Box, Button, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { getProjectStoryById, updateProjectStory } from "../services/projectStoryActions";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useSWR from "swr";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import {
  STORY_STATUS_OPTIONS,
  STORY_STATUS,
  STORY_STATUS_TRANSITIONS,
  StoryStatus
} from "@/app/common/constants/storyStatus";
import ReusableEditor from "@/app/component/richText/textEditor";


const EditStoryForm: React.FC = () => {
  const { storyId, projectId } = useParams();
  const router = useRouter();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  const [title, setTitle] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [status, setStatus] = useState<StoryStatus | undefined>();
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const handleCloseSnackbar = () => setSnackOpen(false);

  const { data: story, isLoading } = useSWR(
    storyId ? [`projectStory`, storyId] : null,
    async () => {
      const resp = await getProjectStoryById(storyId as string);
      return resp?.data;
    }
  );

  // Initialize state from story once
  if (story && !hasInitialized) {
    setTitle(story.title ?? "");
    setDescription(story.description ?? "");
    setStatus((story.status as StoryStatus) ?? STORY_STATUS.TO_DO);
    setHasInitialized(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    // Validate title
    if (!title?.trim()) {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }

    // Validate description (strip tags & trim)
    const plainDesc = description?.replace(/<[^>]*>/g, "").trim();
    if (!plainDesc) {
      setDescriptionError(t("Stories.errors.descriptionRequired"));
      hasError = true;
    } else {
      setDescriptionError("");
    }

    // Validate status transition
    const originalStatus = story?.status as StoryStatus;
    const allowedNextStatuses = STORY_STATUS_TRANSITIONS[originalStatus] || [];
    const isValidTransition = status === originalStatus || allowedNextStatuses.includes(status!);

    if (!isValidTransition) {
      setSnackMessage(t("Stories.errors.invalidStatusTransition"));
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }

    if (hasError) return;

    setIsSubmitting(true);
    try {
      await updateProjectStory(storyId as string, {
        title,
        description,
        status
      });
      setSnackMessage(t("Stories.success.updated"));
      setSnackSeverity("success");
      setSnackOpen(true);
      setTimeout(() => {
        router.push(`/project/view/${projectId}/stories/${storyId}`);
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

  // Filter valid status options 
  const currentStatus = story.status as StoryStatus;
  const allowedStatuses = [currentStatus, ...(STORY_STATUS_TRANSITIONS[currentStatus] || [])];
  const statusOptions = STORY_STATUS_OPTIONS.filter((opt) => allowedStatuses.includes(opt.id));

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
      {/* Header */}
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
                onClick={() => router.push(`/project/view/${projectId}/stories/${storyId}`)}
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
              onClick={() => router.push(`/project/view/${projectId}/stories/${storyId}`)}
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid  #741B92",
                px: 2,
                textTransform: "none"
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
                fontWeight: "bold"
              }}
            >
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : t("Stories.update")}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Form */}
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
          label={t("Stories.storyTitle")}
          type="text"
          required
          value={title ?? ""}
          onChange={(val) => {
            setTitle(val as string);
            setTitleError(false);
          }}
          error={titleError ? t("Stories.errors.titleRequired") : ""}
        />

        <ReusableEditor
          content={description ?? ""}
          onChange={(html) => {
            setDescription(html);
            setDescriptionError(""); 
          }}
          placeholder={t("Stories.placeholders.descriptionUpdate")}
          readOnly={false}
          showSaveButton={false}
        />
        {descriptionError && (
          <Typography variant="caption" color="error">
            {descriptionError}
          </Typography>
        )}

        <FormField
          label={t("Stories.status")}
          type="select"
          value={status ?? STORY_STATUS.TO_DO}
          onChange={(val) => setStatus(val as StoryStatus)}
          options={statusOptions}
        />
      </Box>

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

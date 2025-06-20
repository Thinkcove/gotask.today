"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { getProjectStoryById, updateProjectStory } from "../services/projectStoryService";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import Heading from "@/app/component/header/title";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useSWR from "swr";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

const EditStoryForm = () => {
  const { storyId, projectId } = useParams();
  const router = useRouter();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS); // "Projects"

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const handleCloseSnackbar = () => setSnackOpen(false);

  const fetchStory = async () => {
    const response = await getProjectStoryById(storyId as string);
    return response?.data;
  };

  const {
    data: story,
    isLoading,
    error
  } = useSWR(storyId ? [`projectStory`, storyId] : null, fetchStory, {
    onSuccess: (data) => {
      setTitle(data?.title || "");
      setDescription(data?.description || "");
    }
  });

  useEffect(() => {
    if (error) {
      setSnackMessage(t("Stories.errors.loadFailed"));
      setSnackSeverity("error");
      setSnackOpen(true);
    }
  }, [error, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setShowTitleError(true);
      setSnackMessage(t("Stories.errors.titleRequired"));
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = { title, description };
      await updateProjectStory(storyId as string, payload);

      setSnackMessage(t("Stories.success.updated"));
      setSnackSeverity("success");
      setSnackOpen(true);

      setTimeout(() => {
        router.push(`/project/viewProject/${projectId}/stories/${storyId}`);
      }, 800);
    } catch (error) {
      console.error("Failed to update story:", error);
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
        display: "flex",
        flexDirection: "column",
        height: "87vh",
        width: "100%",
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3,
        p: 2,
        overflow: "hidden"
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          {/* Header with Back Button */}
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={t("Stories.backToStoryDetails")}>
              <IconButton
                onClick={() => router.push(`/project/viewProject/${projectId}/stories/${storyId}`)}
                color="primary"
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Heading title={t("Stories.editStory")} />
          </Box>

          {/* Title Field */}
          <FormField
            label={t("Stories.title")}
            type="text"
            placeholder={t("Stories.placeholders.titleUpdate")}
            required
            value={title}
            onChange={(val) => {
              setTitle(val as string);
              setShowTitleError(false);
            }}
            error={showTitleError ? t("Stories.errors.titleRequired") : ""}
          />

          {/* Description Field */}
          <FormField
            label={t("Stories.description")}
            type="text"
            placeholder={t("Stories.placeholders.descriptionUpdate")}
            multiline
            height={150}
            value={description}
            onChange={(val) => setDescription(val as string)}
          />
        </Box>

        {/* Footer Buttons */}
        <Box
          sx={{
            borderTop: "1px solid #eee",
            pt: 2,
            mt: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 1
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => router.push(`/project/viewProject/${projectId}/stories/${storyId}`)}
            sx={{
              minWidth: 120,
              borderRadius: 1,
              textTransform: "none",
              "&:hover": { bgcolor: "#f5f5f5" }
            }}
          >
            {t("Stories.cancel")}
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              minWidth: 120,
              borderRadius: 1,
              textTransform: "none",
              bgcolor: "#741B92",
              "&:hover": { bgcolor: "#5e1675" }
            }}
          >
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : t("Stories.update")}
          </Button>
        </Box>
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

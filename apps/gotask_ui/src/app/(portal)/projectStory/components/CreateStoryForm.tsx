"use client";

import React, { useState } from "react";
import { Box, Button, Typography, IconButton, Tooltip } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { createProjectStory } from "@/app/(portal)/projectStory/services/projectStoryService";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { ArrowBack } from "@mui/icons-material";

const CreateStoryForm = () => {
  const { projectId } = useParams();
  const router = useRouter();
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS); // "Projects"

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const handleCloseSnackbar = () => setSnackOpen(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError(t("Stories.errors.titleRequired"));
      setSnackMessage(t("Stories.errors.titleRequiredMessage"));
      setSnackSeverity("error");
      setSnackOpen(true);
      return;
    }

    setTitleError("");
    setIsSubmitting(true);

    const createdBy = typeof window !== "undefined" ? localStorage.getItem("userId") : "";

    const payload = {
      title,
      description,
      projectId: projectId as string,
      createdBy: createdBy || "anonymous"
    };

    try {
      await createProjectStory(payload);
      setSnackMessage(t("Stories.success.created"));
      setSnackSeverity("success");
      setSnackOpen(true);

      setTimeout(() => {
        router.push(`/project/viewProject/${projectId}/stories`);
      }, 800);
    } catch (error) {
      console.error("Failed to create story:", error);
      setSnackMessage(t("Stories.errors.creationFailed"));
      setSnackSeverity("error");
      setSnackOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Tooltip title={t("Stories.backToStories")}>
              <IconButton onClick={() => router.back()} color="primary">
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
              {t("Stories.createStory")}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
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
              variant="contained"
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
              {isSubmitting ? t("Stories.creating") : t("Stories.create")}
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
          gap: 2
        }}
      >
        <FormField
          label={t("Stories.title")}
          type="text"
          required
          placeholder={t("Stories.placeholders.title")}
          value={title}
          onChange={(val) => {
            setTitle(val as string);
            setTitleError("");
          }}
          error={titleError}
        />

        <FormField
          label={t("Stories.description")}
          type="text"
          placeholder={t("Stories.placeholders.description")}
          value={description}
          onChange={(val) => setDescription(val as string)}
          multiline
          height={180}
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

export default CreateStoryForm;

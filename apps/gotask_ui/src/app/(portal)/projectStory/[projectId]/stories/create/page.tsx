"use client";

import React from "react";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CreateStoryForm from "../../../components/CreateStoryForm";

const CreateStoryPage = () => {
  const t = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#741B92",
          color: "white",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "600", textTransform: "capitalize" }}>
          {t("Stories.story", { default: "Create Story" })}
        </Typography>
      </Box>

      <CreateStoryForm />
    </>
  );
};

export default CreateStoryPage;

"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CreateIssue from "./createIssues";

const CreateIssuePage: React.FC = () => {
  const trans = useTranslations(LOCALIZATION.TRANSITION.ASSETS);

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
          {trans("createissue")}
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <CreateIssue />
      </Box>
    </>
  );
};

export default CreateIssuePage;

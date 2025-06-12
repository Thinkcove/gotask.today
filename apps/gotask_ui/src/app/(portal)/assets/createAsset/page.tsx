"use client";
import React from "react";
import { CreateAsset } from "./createAsset";
import { Box, Typography } from "@mui/material";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const CreateAction: React.FC = () => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
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
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
            textTransform: "capitalize"
          }}
        >
          {transasset("assets")}
        </Typography>
      </Box>
      <CreateAsset />
    </>
  );
};

export default CreateAction;

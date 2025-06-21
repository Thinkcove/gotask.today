"use client";
import React, { Suspense } from "react";
import CreateTask from "./createTask";
import { Box, Typography } from "@mui/material";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const CreateAction: React.FC = () => {
  const transtask = useTranslations(LOCALIZATION.TRANSITION.TASK);
  return (
    <>
      <Suspense fallback={null}>
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
            {transtask("task")}
          </Typography>
        </Box>
        <CreateTask />
      </Suspense>
    </>
  );
};

export default CreateAction;

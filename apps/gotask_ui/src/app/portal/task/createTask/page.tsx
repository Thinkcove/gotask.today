"use client";
import React from "react";
import CreateTask from "./createTask";
import { Box, Typography } from "@mui/material";

const CreateAction: React.FC = () => {
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
          Task
        </Typography>
      </Box>
      <CreateTask />
    </>
  );
};

export default CreateAction;

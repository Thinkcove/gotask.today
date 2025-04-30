"use client";

import { Box, Typography } from "@mui/material";
import React from "react";
import AccessCreateForm from "../../components/AccessCreateForm";

const AccessCreatePage = () => {
  return (
    <div className="flex flex-col h-full m-0 p-4 overflow-hidden">
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: "#741B92", // Same purple background
          color: "white",
          p: 1.5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "600",
            textTransform: "capitalize",
          }}
        >
          Create Access
        </Typography>
      </Box>

      {/* Content Section */}
      <div className="flex-1 overflow-hidden">
        <AccessCreateForm /> {/* Your custom create form */}
      </div>
    </div>
  );
};

export default AccessCreatePage;

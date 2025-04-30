// app/(dashboard)/access/view/[id]/page.tsx

"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import AccessView from "../../../components/AccessView";

const AccessViewPage = () => {
  return (
    <div className="flex flex-col h-full m-0 p-4 overflow-hidden">
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: "#741B92", // Purple background
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
          View Access
        </Typography>
      </Box>

      {/* Content Section */}
      <div className="flex-1 overflow-hidden">
        {/* Reusable AccessView component handles data fetch & display */}
        <AccessView />
      </div>
    </div>
  );
};

export default AccessViewPage;

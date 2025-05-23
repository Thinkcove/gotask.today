import React from "react";
import { Box } from "@mui/material";
import PreferenceCards from "./preferenceCard";

const PreferenceList = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)",
        p: 3
      }}
    >
      <PreferenceCards />
    </Box>
  );
};

export default PreferenceList;

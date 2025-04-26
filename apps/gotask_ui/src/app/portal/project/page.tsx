import { Box, Typography } from "@mui/material";
import React from "react";
import ProjectList from "./components/projectList";

const page = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#741B92", // Solid color for a bold look
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
          Project
        </Typography>
      </Box>
      <ProjectList />
    </>
  );
};

export default page;

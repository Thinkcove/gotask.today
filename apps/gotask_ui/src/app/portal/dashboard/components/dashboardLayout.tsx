import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ProjectStatus from "./statusDetails/projectStatus";
import TaskStatus from "./statusDetails/taskStatus";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const DashboardLayout = () => {
  const transdashboard = useTranslations(LOCALIZATION.TRANSITION.DASHBOARD);
  return (
    <Box
      sx={{
        p: 3,
        height: "100vh", // full viewport height
        overflowY: "auto", // enable scroll if content overflows
        maxHeight: "calc(100vh - 100px)"
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "#2A1237"
        }}
      >
        {transdashboard("overview")}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TaskStatus />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProjectStatus />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardLayout;

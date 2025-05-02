import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ProjectStatus from "./statusDetails/projectStatus";
import TaskStatus from "./statusDetails/taskStatus";
import { useUser } from "@/app/userContext";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

const DashboardLayout = () => {
  const transdashboard = useTranslations(LOCALIZATION.TRANSITION.DASHBOARD);
  const { user } = useUser(); // Use the user from context

  return (
    <Box
      sx={{
        p: 3,
        height: "100vh",
        overflowY: "auto",
        maxHeight: "calc(100vh - 100px)"
      }}
    >
      {/* Welcome Message */}
      {user && (
        <Typography
          variant="h5"
          sx={{
            mb: 1,
            fontWeight: "medium",
            color: "#741B92",
            textTransform: "capitalize"
          }}
        >
          Welcome, {user.name}!
        </Typography>
      )}

      {/* Main Heading */}
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

      {/* Dashboard Content */}
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

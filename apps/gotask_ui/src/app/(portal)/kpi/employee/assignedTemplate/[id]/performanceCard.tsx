"use client";

import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { KpiAssignment } from "../../../service/templateInterface";

interface PerformanceCardsProps {
  performance: KpiAssignment["performance"];
  assignmentId: string;
}

const PerformanceCards: React.FC<PerformanceCardsProps> = ({ performance }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  if (!Array.isArray(performance) || performance.length === 0) return null;

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        {performance.map((entry, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
                border: "1px solid #e0e0e0",
                backgroundColor: "#fff"
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {transkpi("score")}
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary">
                {entry.percentage ? `${entry.percentage}%` : "N/A"}
              </Typography>
              <Typography variant="body2" mt={1} color="text.secondary">
                {transkpi("startdate")}: <strong>{entry.start_date?.slice(0, 10) || "N/A"}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {transkpi("enddate")}: <strong>{entry.end_date?.slice(0, 10) || "N/A"}</strong>
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default PerformanceCards;

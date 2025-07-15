"use client";

import React from "react";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import LabelValueText from "@/app/component/text/labelValueText";
import useSWR from "swr";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";
import { User } from "@/app/userContext";
import FormattedDateTime from "@/app/component/dateTime/formatDateTime";

interface PerformanceEntry {
  performance_id: string;
  percentage?: number;
  start_date?: string;
  end_date?: string;
  added_by?: string;
  comment?: string;
  signature?: string;
  notes?: any[];
  updated_at?: string;
  _id?: string;
  assignment?: {
    assignment_id: string;
    assigned_to: string;
    template_id: string;
  };
}

interface PerformanceDetailProps {
  performance: PerformanceEntry;
  performanceId: string;
  transkpi: (key: string) => string;
  onBack: () => void;
  mutate: () => void;
}

const PerformanceDetail: React.FC<PerformanceDetailProps> = ({ performance, transkpi, onBack }) => {
  const { data: users = [] } = useSWR("fetch-users", fetcherUserList);

  const getUserNameById = (id: string | undefined) => {
    const user = users.find((u: User) => u.id === id);
    return user ? user.name : "";
  };

  return (
    <Box sx={{ minHeight: "100vh", p: 3, background: "#f9f9fb" }}>
      <Box sx={{ borderRadius: 4, p: 4, bgcolor: "#fff", border: "1px solid #e0e0e0" }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton color="primary" onClick={onBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight={700}>
            {transkpi("performance")}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <LabelValueText
              label={transkpi("score")}
              value={performance.percentage ? `${performance.percentage}%` : "N/A"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LabelValueText
              label={transkpi("startdate")}
              value={
                performance.start_date ? <FormattedDateTime date={performance.start_date} /> : "-"
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LabelValueText
              label={transkpi("enddate")}
              value={performance.end_date ? <FormattedDateTime date={performance.end_date} /> : "-"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LabelValueText
              label={transkpi("addedby")}
              value={getUserNameById(performance.added_by)}
            />
          </Grid>
          <Grid item xs={12}>
            <LabelValueText
              label={transkpi("comments")}
              value={performance.comment || transkpi("nocomment")}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PerformanceDetail;

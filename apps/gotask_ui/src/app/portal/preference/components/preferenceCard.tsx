"use client";
import React, { useState } from "react";
import { Typography, Grid, Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Tune } from "@mui/icons-material";
import { useUser } from "@/app/userContext";
import CardComponent from "@/app/component/card/cardComponent";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";

const ALL_TASK_FIELDS = [
  "status",
  "due_date",
  "title",
  "user_name",
  "project_name",
  "variation",
  "estimated_time",
  "time_spent_total",
  "remaining_time",
  "severity"
];

const PreferenceCards: React.FC = () => {
  const { user } = useUser();
  const preferences = user?.preferences ?? [];

  if (!preferences.length) {
    return <EmptyState imageSrc={NoSearchResultsImage} message="No preferences configured" />;
  }

  const formatFieldName = (field: string) => {
    return field.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // We keep the excluded fields in state so user can interact
  // Initialize state with preferences exclude_fields
  // For demo purpose, we'll only handle toggling locally
  const [excludeFieldsState, setExcludeFieldsState] = React.useState(() => {
    const state: Record<string, string[]> = {};
    preferences.forEach((pref) => {
      state[pref._id] = [...pref.exclude_fields];
    });
    return state;
  });

  const handleToggle = (prefId: string, field: string) => {
    setExcludeFieldsState((prev) => {
      const currentExcluded = prev[prefId] || [];
      if (currentExcluded.includes(field)) {
        // Remove field from excluded
        return {
          ...prev,
          [prefId]: currentExcluded.filter((f) => f !== field)
        };
      } else {
        // Add field to excluded
        return {
          ...prev,
          [prefId]: [...currentExcluded, field]
        };
      }
    });
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {preferences.map((pref) => (
          <Grid item xs={12} sm={6} md={4} key={pref._id}>
            <CardComponent sx={{ transition: "0.3s ease" }}>
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#F3E5F5",
                  borderRadius: "8px",
                  px: 2,
                  py: 1,
                  mb: 2
                }}
              >
                <Tune sx={{ color: "#741B92", mr: 1 }} />
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ textTransform: "capitalize", color: "#741B92" }}
                >
                  {pref.module_name}
                </Typography>
              </Box>

              {/* Checkbox Section */}
              <Box sx={{ px: 3, py: 2, borderRadius: 2 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1, color: "#6A1B9A", textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Excluded Fields (Check to exclude)
                </Typography>

                <FormGroup>
                  {ALL_TASK_FIELDS.map((field) => (
                    <FormControlLabel
                      key={field}
                      control={
                        <Checkbox
                          checked={excludeFieldsState[pref._id]?.includes(field) || false}
                          onChange={() => handleToggle(pref._id, field)}
                          sx={{ color: "#741B92", "&.Mui-checked": { color: "#4A148C" } }}
                        />
                      }
                      label={formatFieldName(field)}
                    />
                  ))}
                </FormGroup>
              </Box>
            </CardComponent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PreferenceCards;

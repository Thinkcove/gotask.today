"use client";
import React from "react";
import { Typography, Grid, Box } from "@mui/material";
import { Tune } from "@mui/icons-material";
import { useUser } from "@/app/userContext";
import CardComponent from "@/app/component/card/cardComponent";
import EmptyState from "@/app/component/emptyState/emptyState";
import NoSearchResultsImage from "@assets/placeholderImages/nofilterdata.svg";

const PreferenceCards: React.FC = () => {
  const { user } = useUser();
  const preferences = user?.preferences ?? [];

  if (!preferences.length) {
    return <EmptyState imageSrc={NoSearchResultsImage} message="No preferences configured" />;
  }
  const formatFieldName = (field: string) => {
    return field
      .replace(/_/g, " ") // replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // capitalize first letter of each word
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {preferences.map((pref) => (
          <Grid item xs={12} sm={6} md={4} key={pref._id}>
            <CardComponent
              sx={{
                transition: "0.3s ease"
              }}
            >
              {/* Header Section */}
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

              {/* Fields Section */}
              <Box sx={{ px: 3, py: 2, borderRadius: 2 }}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  sx={{ mb: 1, color: "#6A1B9A", textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  Excluded Fields
                </Typography>

                {pref.exclude_fields.length > 0 ? (
                  <Box
                    component="ul"
                    sx={{ pl: 2, m: 0, listStyle: "disc", color: "text.primary" }}
                  >
                    {pref.exclude_fields.map((field, index) => (
                      <li key={index} style={{ marginBottom: 4 }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          {formatFieldName(field)}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    No fields excluded
                  </Typography>
                )}
              </Box>
            </CardComponent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PreferenceCards;

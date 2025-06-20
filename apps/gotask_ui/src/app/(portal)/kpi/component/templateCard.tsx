"use client";
import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Template } from "../service/templateInterface";


interface TemplateCardsProps {
  templates: Template[] | null;
}

const TemplateCards: React.FC<TemplateCardsProps> = ({ templates }) => {
  const transTemplate = useTranslations(LOCALIZATION.TRANSITION.KPI);

  if (!templates || templates.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          {transTemplate("notemplates")}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {templates.map((template) => (
        <Grid item xs={12} sm={6} md={4} key={template.id}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {template.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {template.description || transTemplate("nodescription")}
              </Typography>
              <Typography variant="body1" color="text.primary">
                {transTemplate("weightage")}: {template.weightage}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default TemplateCards;
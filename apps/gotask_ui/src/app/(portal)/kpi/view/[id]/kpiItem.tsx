"use client";
import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Template } from "../../service/templateInterface";
import { useRouter } from "next/navigation";
import StatusIndicator from "@/app/component/status/statusIndicator";
import { getUserStatusColor } from "@/app/common/constants/status";
import { mildStatusColor } from "@/app/common/constants/kpi";

interface TemplateCardsProps {
  templates: Template[] | null;
  onDelete: (templateId: string) => Promise<void>;
  onUpdate: (templateId: string, updatedFields: Partial<Template>) => Promise<void>;
  onView?: (templateId: string) => void;
  getUserStatusColor?: (status: string) => string;
}

const KpiItem: React.FC<TemplateCardsProps> = ({ templates, onView }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();

  if (!templates || templates.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          {transkpi("notemplates")}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {templates.map((template) => {
        const status = template.status ? template.status.toLowerCase() : "inactive";
        return (
          <Grid item xs={12} sm={6} md={4} key={template.id || Math.random()}>
            <Card
              elevation={3}
              sx={{
                cursor: "pointer",
                backgroundColor: mildStatusColor(status),
                borderRadius: 4,
                border: `1px solid ${getUserStatusColor?.(status)}`,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                boxShadow: "none",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "none"
                }
              }}
              onClick={() => {
                if (onView) {
                  onView(template.id);
                } else {
                  router.push(`/kpi/view/${template.id}`);
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {template.title}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="body1">
                    {transkpi("weightage")}: <strong>{template.measurement_criteria}</strong>
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">
                    {transkpi("frequency")}: <strong>{template.frequency || "N/A"}</strong>
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <StatusIndicator
                    status={status}
                    getColor={getUserStatusColor}
                    dotSize={8}
                    capitalize
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default KpiItem;

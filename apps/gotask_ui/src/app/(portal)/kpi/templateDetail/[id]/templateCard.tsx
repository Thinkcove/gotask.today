"use client";
import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Template } from "../../service/templateInterface";
import { useRouter } from "next/navigation";
import { Cancel, CheckCircle } from "@mui/icons-material";

interface TemplateCardsProps {
  templates: Template[] | null;
  onDelete: (templateId: string) => void;
  onUpdate: (templateId: string, updatedFields: Partial<Template>) => void;
  onView?: (templateId: string) => void;
}

const TemplateCards: React.FC<TemplateCardsProps> = ({ templates }) => {
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
    <>
      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id || Math.random()}>
            <Card
              elevation={3}
              sx={{
                cursor: "pointer",
                backgroundColor: "#f3e5f5",
                border: "1px solid #ccc",
                borderRadius: 4,
                transition: "border-color 0.2s ease-in-out",
                "&:hover": {
                  borderColor: "primary.main"
                }
              }}
              onClick={() => router.push(`/kpi/templateDetail/${template.id}`)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {template.name}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="body1">
                    {transkpi("weightage")}: <strong>{template.weightage}</strong>
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">
                    {transkpi("frequency")}: <strong>{template.frequency || "N/A"}</strong>
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  {template.status === "Active" ? (
                    <>
                      <CheckCircle sx={{ color: "green", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "green" }}>
                        {transkpi("active")}
                      </Typography>
                    </>
                  ) : template.status === "Inactive" ? (
                    <>
                      <Cancel sx={{ color: "grey", fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: "grey" }}>
                        {transkpi("inactive")}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" sx={{ color: "orange" }}>
                        {transkpi("locked")}
                      </Typography>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default TemplateCards;

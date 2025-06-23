"use client";
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Template } from "../service/templateInterface";
import { createTemplate } from "../service/templateAction";
import { useRouter } from "next/navigation";
import TemplateInput from "./templateInput";

interface CreateTemplateProps {
  mutate?: () => void;
}

const CreateTemplate: React.FC<CreateTemplateProps> = ({ mutate }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<Template>>({
    title: "",
    description: "",
    frequency: "",
    status: "",
    measurement_criteria: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = <K extends keyof Partial<Template>>(
    field: K,
    value: Partial<Template>[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = transkpi("titleerror");
    if (!formData.frequency) newErrors.frequency = transkpi("frequencyerror");
    if (!formData.status) newErrors.status = transkpi("statuserror");
    if (!formData.measurement_criteria)
      newErrors.measurement_criteria = transkpi("measurement_criteriaerror");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    const newTemplate: Partial<Template> = {
      title: formData.title,
      description: formData.description || undefined,
      measurement_criteria: formData.measurement_criteria,
      frequency: formData.frequency,
      status: formData.status
    };

    try {
      await createTemplate(newTemplate);
      if (mutate) {
        await mutate();
      }
      router.push("/kpi");
    } catch (err: any) {
      console.error("Error creating template:", err);
      setErrors({ general: err.message || transkpi("createFailed") });
    }
  };

  const handleCancel = () => {
    router.push("/kpi");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflowY: "auto",
        p: { xs: 2, md: 3 },
        pb: 16
      }}
    >
      <Typography variant="h5" gutterBottom>
        {transkpi("createnewtemplate")}
      </Typography>

      <TemplateInput formData={formData} handleChange={handleChange} errors={errors} />

      {errors.general && (
        <Typography color="error.main" fontSize="0.875rem" mb={2}>
          {errors.general}
        </Typography>
      )}

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          background: "inherit",
          p: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          zIndex: 10
        }}
      >
        <Button onClick={handleCancel} color="secondary">
          {transkpi("cancel")}
        </Button>
        <Button onClick={handleCreate} color="primary" variant="contained">
          {transkpi("create")}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTemplate;

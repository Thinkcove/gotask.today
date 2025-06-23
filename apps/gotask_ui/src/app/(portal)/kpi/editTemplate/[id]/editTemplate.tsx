"use client";
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useRouter } from "next/navigation";
import { Template } from "../../service/templateInterface";
import { updateTemplate } from "../../service/templateAction";
import TemplateInput from "../../createTemplate/templateInput";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";

interface EditTemplateProps {
  template: Template;
  mutate?: () => void;
}

const EditTemplate: React.FC<EditTemplateProps> = ({ template, mutate }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<Template>>({
    title: template.title,
    description: template.description,
    measurement_criteria: template.measurement_criteria,
    frequency: template.frequency,
    status: template.status
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

  const handleUpdate = async () => {
    if (!validateForm()) return;

    const updatedFields: Partial<Template> = {
      title: formData.title,
      description: formData.description || undefined,
      measurement_criteria: formData.measurement_criteria,
      frequency: formData.frequency,
      status: formData.status
    };

    try {
      await updateTemplate(template.id, updatedFields);
      if (mutate) await mutate();
      setSnackbar({
        open: true,
        message: transkpi("updatesuccess"),
        severity: SNACKBAR_SEVERITY.SUCCESS
      });
      setTimeout(() => {
        router.push("/kpi");
      }, 1500);
    } catch {
      setSnackbar({
        open: true,
        message: transkpi("updateFailed"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  const handleCancel = () => {
    router.push("/kpi");
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          overflowY: "auto",
          p: { xs: 2, md: 3 },
          pb: 16
        }}
      >
        <Typography variant="h5" gutterBottom>
          {transkpi("edittemplate")}
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
          <Button onClick={handleUpdate} color="primary" variant="contained">
            {transkpi("update")}
          </Button>
        </Box>
      </Box>
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default EditTemplate;

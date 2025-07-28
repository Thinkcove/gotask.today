"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useRouter } from "next/navigation";
import TemplateInput from "./templateInput";
import { Template } from "../../service/templateInterface";
import { createTemplate } from "../../service/templateAction";
import { STATUS_OPTIONS } from "@/app/common/constants/kpi";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import FormHeader from "@/app/component/header/formHeader";

interface CreateTemplateProps {
  mutate?: () => void;
}

const CreateTemplate: React.FC<CreateTemplateProps> = ({}) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Template>>({
    title: "",
    description: "",
    frequency: "",
    status: STATUS_OPTIONS.ACTIVE,
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
    if (!formData.title) newErrors.title = transkpi("nameerror");
    if (!formData.frequency) newErrors.frequency = transkpi("frequencyerror");
    if (!formData.status) newErrors.status = transkpi("statuserror");
    if (!formData.measurement_criteria) newErrors.measurement_criteria = transkpi("weightageerror");
    if (!formData.description) newErrors.description = transkpi("descriptionerror");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    const updatedData = {
      ...formData
    };
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = updatedData;
      await createTemplate(payload);
      setSnackbarMessage(transkpi("createsuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      router.back();
    } catch (err: any) {
      console.error("Error creating template:", err);
      setSnackbarMessage(transkpi("createfailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      sx={{
        maxWidth: "1400px",
        margin: "0 auto",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        overflowY: "auto"
      }}
    >
      {/* Sticky Top Bar */}
      <FormHeader
        isEdit={false}
        onCancel={handleBack}
        onSubmit={handleSubmit}
        createHeading={transkpi("createnewtemplate")}
        create={transkpi("create")}
        cancel={transkpi("cancel")}
        isSubmitting={isSubmitting}
      />
      <Box
        sx={{
          px: 2,
          pb: 2,
          maxHeight: "calc(100vh - 150px)",
          overflowY: "auto",
          width: "100%"
        }}
      >
        <TemplateInput
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          handleInputChange={handleInputChange}
        />

        {errors.general && (
          <Typography color="error.main" fontSize="0.875rem" mb={2}>
            {errors.general}
          </Typography>
        )}
      </Box>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default CreateTemplate;

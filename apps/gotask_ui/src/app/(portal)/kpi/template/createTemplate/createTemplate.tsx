"use client";
import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useRouter } from "next/navigation";
import TemplateInput from "./templateInput";
import { Template } from "../../service/templateInterface";
import { createTemplate } from "../../service/templateAction";
import { STATUS_OPTIONS } from "@/app/common/constants/kpi";
import CustomSnackbar from "@/app/component/snackBar/snackbar";

interface CreateTemplateProps {
  mutate?: () => void;
}

const CreateTemplate: React.FC<CreateTemplateProps> = ({}) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

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

  const handleCreate = async () => {
    const updatedData = {
      ...formData
    };
    if (!validateForm()) return;

    try {
      const payload = updatedData;
      await createTemplate(payload);
      setSnackbarMessage(transkpi("createsuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (err: any) {
      console.error("Error creating template:", err);
      setSnackbarMessage(transkpi("createfailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
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
      <Box
        sx={{
          position: "sticky",
          top: 0,
          px: 2,
          py: 2,
          zIndex: 1000,
          backgroundColor: "#fff"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
            {transkpi("createnewtemplate")}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid #741B92",
                px: 2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)"
                }
              }}
              onClick={handleCancel}
            >
              {transkpi("cancel")}
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: "30px",
                backgroundColor: "#741B92",
                color: "white",
                px: 2,
                textTransform: "none",
                fontWeight: "bold"
              }}
              onClick={handleCreate}
            >
              {transkpi("create")}
            </Button>
          </Box>
        </Box>
      </Box>
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

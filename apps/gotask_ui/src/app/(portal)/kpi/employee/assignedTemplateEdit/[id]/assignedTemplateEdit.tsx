"use client";

import React, { useState } from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import { updateKpiAssignment } from "../../../service/templateAction";
import FormField from "@/app/component/input/formField";
import { STATUS_OPTIONS, KPI_FREQUENCY } from "@/app/common/constants/kpi";
import { KpiAssignment } from "../../../service/templateInterface";
import { useUser } from "@/app/userContext";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { useRouter } from "next/navigation";

interface Props {
  assignment: KpiAssignment;
  transkpi: (key: string) => string;
  mutate: () => void;
}

const AssignedTemplateEdit: React.FC<Props> = ({ assignment, transkpi, mutate }) => {
  const { user: loginUser } = useUser();
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [form, setForm] = useState({
    kpi_Title: assignment.kpi_Title ?? "",
    kpi_Description: assignment.kpi_Description ?? "",
    measurement_criteria: assignment.measurement_criteria || "",
    frequency: assignment.frequency || "",
    weightage: assignment.weightage || "",
    target_value: assignment.target_value || "",
    actual_value: assignment.actual_value || 0,
    assigned_by: assignment.assigned_by || "",
    reviewer_id: assignment.reviewer_id || "",
    status: assignment.status || "",
    comments: Array.isArray(assignment.comments)
      ? (assignment.comments[0] ?? "")
      : (assignment.comments ?? "")
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  if (!assignment || !loginUser) return null;

  const handleChange = (key: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.kpi_Title) newErrors.kpi_Title = transkpi("titleerror");
    if (!form.frequency) newErrors.frequency = transkpi("frequencyerror");
    if (!form.status) newErrors.status = transkpi("statuserror");
    if (!form.measurement_criteria)
      newErrors.measurement_criteria = transkpi("measurement_criteriaerror");
    if (!form.weightage) newErrors.weightage = transkpi("weightageerror");
    if (!form.assigned_by) newErrors.assigned_by = transkpi("assignedbyerror");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      await updateKpiAssignment(assignment.assignment_id, {
        ...form,
        measurement_criteria: form.measurement_criteria,
        comments: [form.comments],
        authUserId: loginUser.id
      });

      mutate();
      setSnackbarMessage(transkpi("updatesuccessassignment"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err: any) {
      setSnackbarMessage(err?.message || transkpi("updateFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Box p={3} sx={{ overflowY: "auto", maxHeight: "calc(100vh - 60px)" }}>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        {transkpi("editassignment")}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("title")} *`}
            type="text"
            value={form.kpi_Title}
            onChange={(val) => handleChange("kpi_Title", val)}
            placeholder={transkpi("entertitle")}
            error={errors.kpi_Title}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={transkpi("description")}
            type="text"
            value={form.kpi_Description}
            onChange={(val) => handleChange("kpi_Description", val)}
            placeholder={transkpi("enterdescription")}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("measurementcriteria")} *`}
            type="text"
            value={form.measurement_criteria}
            onChange={(val) => handleChange("measurement_criteria", String(val))}
            placeholder={transkpi("entermeasurementcriteria")}
            error={errors.measurement_criteria}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("frequency")} *`}
            type="select"
            options={Object.values(KPI_FREQUENCY)}
            value={form.frequency}
            onChange={(val) => handleChange("frequency", val)}
            error={errors.frequency}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("weightage")} *`}
            type="text"
            value={form.weightage}
            onChange={(val) => handleChange("weightage", String(val))}
            placeholder={transkpi("enterweightage")}
            error={errors.weightage}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("assignedby")} *`}
            type="text"
            value={form.assigned_by}
            onChange={(val) => handleChange("assigned_by", val)}
            disabled
            error={errors.assigned_by}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("status")} *`}
            type="select"
            options={Object.values(STATUS_OPTIONS)}
            value={form.status}
            onChange={(val) => handleChange("status", val)}
            error={errors.status}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
        <Button variant="outlined" onClick={handleCancel}>
          {transkpi("cancel")}
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#741B92" }} onClick={handleUpdate}>
          {transkpi("update")}
        </Button>
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

export default AssignedTemplateEdit;

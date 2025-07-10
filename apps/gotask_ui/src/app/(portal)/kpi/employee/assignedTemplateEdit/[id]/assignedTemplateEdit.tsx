"use client";

import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { updateKpiAssignment } from "../../../service/templateAction";
import { KpiAssignment } from "../../../service/templateInterface";
import { useUser } from "@/app/userContext";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";
import KpiFormFields from "../../addTemplate/[id]/assignmentInput";

interface Props {
  assignment: KpiAssignment;
  transkpi: (key: string) => string;
  mutate: () => void;
}

const AssignedTemplateEdit: React.FC<Props> = ({ assignment, transkpi, mutate }) => {
  const { user: loginUser } = useUser();
  const router = useRouter();
  const { data: users = [] } = useSWR("fetch-users", fetcherUserList);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [form, setForm] = useState<Partial<KpiAssignment>>({
    kpi_Title: assignment.kpi_Title ?? "",
    kpi_Description: assignment.kpi_Description ?? "",
    measurement_criteria: assignment.measurement_criteria || "",
    frequency: assignment.frequency || "",
    weightage: assignment.weightage || "",
    target_value: assignment.target_value || "",
    actual_value: assignment.actual_value || "",
    assigned_by: assignment.assigned_by || "",
    reviewer_id: assignment.reviewer_id || "",
    status: assignment.status || "",
    comments: Array.isArray(assignment.comments)
      ? (assignment.comments[0] ?? "")
      : (assignment.comments ?? "")
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  if (!assignment || !loginUser) return null;

  const handleChange = (key: keyof KpiAssignment, value: any) => {
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
        comments: Array.isArray(form.comments)
          ? form.comments
          : form.comments
            ? [form.comments]
            : undefined,
        authUserId: loginUser.id
      });

      mutate();
      setSnackbarMessage(transkpi("updatesuccessassignment"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err) {
      console.error("Failed to update:", err);
      setSnackbarMessage(transkpi("updateFailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box p={3} sx={{ overflowY: "auto", maxHeight: "calc(100vh - 60px)" }}>
      <Typography variant="h6" fontWeight="bold" mb={3} color="#741B92">
        {transkpi("editassignment")}
      </Typography>

      <KpiFormFields
        form={form}
        errors={errors}
        handleChange={handleChange}
        disabledFields={["assigned_by"]}
        showCommentsField={false}
        users={users}
      />

      <Box display="flex" justifyContent="flex-start" mt={3}>
        <Button
          variant="outlined"
          sx={{ borderColor: "#741B92", color: "#741B92" }}
          onClick={() => router.push(`/kpi/employee/addScore/${assignment.assignment_id}`)}
        >
          {transkpi("addperformance")}
        </Button>
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
        <Button variant="outlined" onClick={() => router.back()}>
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

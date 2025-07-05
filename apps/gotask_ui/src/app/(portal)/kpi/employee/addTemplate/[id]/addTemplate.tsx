"use client";

import React, { useState } from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import FormField from "@/app/component/input/formField";
import { KPI_FREQUENCY, STATUS_OPTIONS } from "@/app/common/constants/kpi";
import { createKpiAssignment, createTemplate } from "../../../service/templateAction";
import useSWR from "swr";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";
import { User, useUser } from "@/app/userContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";
import { Template } from "../../../service/templateInterface";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import CommonDialog from "@/app/component/dialog/commonDialog";

interface AddTemplateProps {
  templates: Template[];
  userId: string;
  mutate: () => void;
  user: User;
}

const AddTemplate: React.FC<AddTemplateProps> = ({ templates, userId, mutate, user }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();
  const { data: users = [] } = useSWR("fetch-users", fetcherUserList);
  const { user: loginUser } = useUser();

  const [form, setForm] = useState({
    template_id: "",
    title: "",
    description: "",
    frequency: "",
    weightage: "",
    target_value: "",
    comments: "",
    status: STATUS_OPTIONS.ACTIVE,
    assigned_by: loginUser?.name || "",
    reviewer_id: ""
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleTemplateAssign = () => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      setForm((prev) => ({
        ...prev,
        template_id: template.id,
        title: template.title || "",
        description: template.kpi_Description || template.description || "",
        frequency: template.frequency || "",
        weightage: template.measurement_criteria || "",
        comments: template.comments || "",
        status: template.status || ""
      }));
    }
    setOpenDialog(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title) newErrors.title = transkpi("titleerror");
    if (!form.frequency) newErrors.frequency = transkpi("frequencyerror");
    if (!form.status) newErrors.status = transkpi("statuserror");
    if (!form.weightage) newErrors.weightage = transkpi("weightageerror");
    if (!form.assigned_by) newErrors.assigned_by = transkpi("assignedbyerror");
    if (!form.target_value) newErrors.target_value = transkpi("targetvalue");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        user_id: userId,
        ...form,
        kpi_Description: form.description?.trim(),
        measurement_criteria: form.weightage,
        target_value: form.target_value,
        ...(form.template_id ? { template_id: form.template_id } : { kpi_Title: form.title }),
        assigned_by: users.find((u: User) => u.name === form.assigned_by)?.id,
        reviewer_id: users.find((u: User) => u.name === form.reviewer_id)?.name || undefined
      };
      await createKpiAssignment(payload);
      setSnackbarMessage(transkpi("assignsuccess"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      mutate();
      router.push(`/kpi/employee/view/${userId}`);
    } catch (err: any) {
      setSnackbarMessage(err.message || transkpi("assignfailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSaveAsTemplate = async () => {
    if (!validateForm()) return;
    try {
      const payload: Partial<Template> = {
        title: form.title,
        description: form.description?.trim(),
        frequency: form.frequency,
        measurement_criteria: form.weightage,
        comments: form.comments,
        status: form.status,
        kpi_Title: form.title,
        target_value: form.target_value,
        reviewer_id: form.reviewer_id,
        assigned_by: form.assigned_by
      };

      await createTemplate(payload);
      setSnackbarMessage(transkpi("templatesavesuccess") || "Template saved successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMessage(err.message || "Failed to save template");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Sticky Header */}
      <Box
        sx={{
          px: 4,
          py: 2,
          position: "sticky",
          top: 0,
          zIndex: 100
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <ArrowBackIcon
              sx={{ cursor: "pointer", color: "#741B92" }}
              onClick={() => history.back()}
            />
            <AlphabetAvatar userName={user.name} size={48} fontSize={18} />
            <Box>
              <Typography variant="h6">{user.name}</Typography>
              {user.role?.name && (
                <Typography variant="body2" color="textSecondary">
                  {user.role.name}
                </Typography>
              )}
            </Box>
          </Box>
          <Box display="flex" gap={2}>
            <Button variant="outlined" onClick={() => setOpenDialog(true)}>
              {transkpi("assigntemplate")}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Scrollable Form Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 4,
          py: 2,
          pb: 16
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <FormField
              label={`${transkpi("title")} ${transkpi("required")}`}
              placeholder={transkpi("entertitle")}
              type="text"
              value={form.title}
              onChange={(val) => setForm({ ...form, title: String(val) })}
              error={errors.title}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormField
              label={transkpi("description")}
              placeholder={transkpi("enterdescription")}
              type="text"
              value={form.description}
              onChange={(val) => setForm({ ...form, description: String(val) })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormField
              label={`${transkpi("frequency")} ${transkpi("required")}`}
              placeholder={transkpi("enterfrequency")}
              type="select"
              options={Object.values(KPI_FREQUENCY)}
              value={form.frequency}
              onChange={(val) => setForm({ ...form, frequency: String(val) })}
              error={errors.frequency}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormField
              label={`${transkpi("weightage")} ${transkpi("required")}`}
              placeholder={transkpi("enterweightage")}
              type="text"
              value={form.weightage}
              onChange={(val) => setForm({ ...form, weightage: String(val) })}
              error={errors.weightage}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormField
              label={`${transkpi("targetvalue")} ${transkpi("required")}`}
              placeholder={transkpi("entertargetvalue")}
              type="text"
              value={form.target_value}
              onChange={(val) => setForm({ ...form, target_value: String(val) })}
              error={errors.target_value}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormField
              label={`${transkpi("assignedby")} ${transkpi("required")}`}
              type="select"
              options={users.map((u: User) => ({ id: u.name, name: u.name }))}
              value={form.assigned_by}
              onChange={(val) => setForm({ ...form, assigned_by: String(val) })}
              error={errors.assigned_by}
              disabled
            />
          </Grid>
          {userId === form.assigned_by && (
            <Grid item xs={12} md={4}>
              <FormField
                label={transkpi("reviewerid")}
                type="select"
                options={users.map((u: User) => ({ id: u.name, name: u.name }))}
                value={form.reviewer_id}
                onChange={(val) => setForm({ ...form, reviewer_id: String(val) })}
              />
            </Grid>
          )}
          <Grid item xs={12} md={4}>
            <FormField
              label={`${transkpi("status")} ${transkpi("required")}`}
              placeholder={transkpi("enterstatus")}
              type="select"
              options={Object.values(STATUS_OPTIONS)}
              value={form.status}
              onChange={(val) => setForm({ ...form, status: String(val) })}
              error={errors.status}
            />
          </Grid>
          <Grid item xs={12}>
            <FormField
              label={transkpi("comments")}
              placeholder={transkpi("entercomments")}
              type="text"
              value={form.comments}
              onChange={(val) => setForm({ ...form, comments: String(val) })}
              multiline
            />
          </Grid>
        </Grid>
      </Box>

      {/* Fixed Footer Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#fff",
          borderTop: "1px solid #ddd",
          px: 4,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          zIndex: 200,
          flexWrap: "wrap"
        }}
      >
        <Button variant="contained" color="primary" onClick={handleSaveAsTemplate}>
          {transkpi("saveastemplate")}
        </Button>
        <Box display="flex" gap={2} mt={{ xs: 2, sm: 0 }}>
          <Button variant="outlined" onClick={() => router.back()}>
            {transkpi("cancel")}
          </Button>
          <Button variant="contained" sx={{ backgroundColor: "#741B92" }} onClick={handleSubmit}>
            {transkpi("assign")}
          </Button>
        </Box>
      </Box>

      {/* Dialog */}
      <CommonDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleTemplateAssign}
        title={transkpi("selecttemplate")}
        submitLabel={transkpi("assign")}
        cancelLabel={transkpi("cancel")}
        submitColor="#741B92"
      >
        <FormField
          label={transkpi("assigntemplate")}
          type="select"
          placeholder={transkpi("entertemplate")}
          options={templates.map((template) => ({
            id: template.id,
            name: template.title
          }))}
          value={selectedTemplateId}
          onChange={(val) => setSelectedTemplateId(String(val))}
        />
      </CommonDialog>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Box>
  );
};

export default AddTemplate;

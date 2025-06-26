"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import FormField from "@/app/component/input/formField";
import { KPI_FREQUENCY, STATUS_OPTIONS } from "@/app/common/constants/kpi";
import { createKpiAssignment, fetchTemplates } from "../../../service/templateAction";

interface AssigneeDetailProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role?: { name: string };
  };
  assignedTemplates: any[];
  mutate: () => void;
}

const AssigneeDetail: React.FC<AssigneeDetailProps> = ({ user, assignedTemplates, mutate }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [openForm, setOpenForm] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [form, setForm] = useState({
    measurement_criteria: "",
    frequency: "",
    weightage: 1,
    target_Value: 0,
    comments: "",
    status: "Active",
    assigned_by: "",
    reviewer_id: "",
    saveAs_Template: false
  });

  useEffect(() => {
    const fetchData = async () => {
      const allTemplates = await fetchTemplates();
      setTemplates(allTemplates);
    };
    fetchData();
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId === "create") {
      setForm({
        measurement_criteria: "",
        frequency: "",
        weightage: 1,
        target_Value: 0,
        comments: "",
        status: "Active",
        assigned_by: "",
        reviewer_id: "",
        saveAs_Template: false
      });
      setOpenForm(true);
    } else {
      const template = templates.find((tpl) => tpl.id === templateId);
      if (template) {
        setForm({
          measurement_criteria: template.measurement_criteria || "",
          frequency: template.frequency || "",
          weightage: 1,
          target_Value: 0,
          comments: "",
          status: "Active",
          assigned_by: "",
          reviewer_id: "",
          saveAs_Template: false
        });
        setOpenForm(true);
      }
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.frequency) newErrors.frequency = transkpi("frequencyerror");
    if (!form.status) newErrors.status = transkpi("statuserror");
    if (!form.weightage) newErrors.weightage = transkpi("weightageerror");
    if (!form.assigned_by) newErrors.assignedBy = transkpi("assignedbyerror");
    if (!form.measurement_criteria) newErrors.measurement_criteria = transkpi("measurementerror");
    if (!form.target_Value) newErrors.target_Value = transkpi("targetvalue");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    const payload = {
      user_id: user.id,
      template_id: selectedTemplateId === "create" ? undefined : selectedTemplateId,
      ...form,
      reviewer_id: form.reviewer_id || undefined
    };

    try {
      await createKpiAssignment(payload);
      setOpenForm(false);
      setSelectedTemplateId("");
      mutate();
    } catch (err) {
      console.error("Error assigning template:", err);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        pb: 10,
        mb: 4,
        background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)",
        overflow: "auto",
        maxHeight: "100vh",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      {/* Header with Back Icon */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <ArrowBackIcon sx={{ cursor: "pointer" }} onClick={() => history.back()} />
        <Avatar src={user.avatarUrl || ""} alt={user.name} />
        <Box>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.email}
          </Typography>
          {user.role?.name && (
            <Typography variant="body2" color="textSecondary">
              {transkpi("role")}: {user.role.name}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} sx={{ mb: 3 }}>
        <Tab label={transkpi("assignedTemplates")} />
        <Tab label={transkpi("assignTemplate")} />
      </Tabs>

      {/* Assigned Templates */}
      {tabIndex === 0 && (
        <Box mb={3}>
          <Typography variant="body2" color="textSecondary" mb={1}>
            {transkpi("assignedTemplates")}:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {assignedTemplates && assignedTemplates.length > 0 ? (
              assignedTemplates.flatMap((assignment) =>
                (assignment.template || []).map((tpl: any, i: number) => (
                  <Chip
                    key={`${assignment.assignment_id}-${tpl.template_id || i}`}
                    label={tpl.title}
                    size="small"
                  />
                ))
              )
            ) : (
              <Typography variant="body2">{transkpi("noTemplatesAssigned")}</Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Assign Template Form */}
      {tabIndex === 1 && (
        <>
          <Box
            mb={3}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <Box sx={{ flex: 1, minWidth: "250px", maxWidth: "400px" }}>
              <FormControl fullWidth size="small">
                <InputLabel>{transkpi("assignTemplate")}</InputLabel>
                <Select
                  value={selectedTemplateId}
                  onChange={(e) => handleTemplateSelect(e.target.value)}
                  label={transkpi("assignTemplate")}
                >
                  {templates.map((template) => (
                    <MenuItem key={template.id} value={template.id}>
                      {template.title}
                    </MenuItem>
                  ))}
                  <MenuItem value="create">+ {transkpi("createNewTemplate")}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {openForm && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "30px",
                    color: "black",
                    border: "2px solid #741B92",
                    textTransform: "none",
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.2)"
                    }
                  }}
                  onClick={() => {
                    setOpenForm(false);
                    setSelectedTemplateId("");
                  }}
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
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "rgb(202, 187, 201)"
                    }
                  }}
                  onClick={handleSubmit}
                >
                  {transkpi("assign")}
                </Button>
              </Box>
            )}
          </Box>

          {openForm && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormField
                    label={`${transkpi("measurementCriteria")} ${transkpi("required")}`}
                    type="text"
                    required
                    placeholder={transkpi("enterMeasurementCriteria")}
                    value={form.measurement_criteria}
                    onChange={(val) => setForm({ ...form, measurement_criteria: String(val) })}
                    error={errors.measurement_criteria}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormField
                    label={`${transkpi("frequency")} ${transkpi("required")}`}
                    type="select"
                    required
                    options={Object.values(KPI_FREQUENCY)}
                    value={form.frequency}
                    onChange={(val) => setForm({ ...form, frequency: String(val) })}
                    error={errors.frequency}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormField
                    label={transkpi("weightage")}
                    type="number"
                    required
                    placeholder={transkpi("enterWeightage")}
                    value={form.weightage}
                    onChange={(val) => setForm({ ...form, weightage: +val })}
                    error={errors.weightage}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormField
                    label={transkpi("targetValue")}
                    type="number"
                    required
                    placeholder={transkpi("enterTargetValue")}
                    value={form.target_Value}
                    onChange={(val) => setForm({ ...form, target_Value: +val })}
                    error={errors.target_Value}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormField
                    label={`${transkpi("assignedBy")} ${transkpi("required")}`}
                    type="text"
                    required
                    placeholder={transkpi("enterAssignedBy")}
                    value={form.assigned_by}
                    onChange={(val) => setForm({ ...form, assigned_by: String(val) })}
                    error={errors.assigned_by}
                  />
                </Grid>
                {form.assigned_by && form.assigned_by !== user.id && (
                  <Grid item xs={12} md={4}>
                    <FormField
                      label={transkpi("reviewerId")}
                      type="text"
                      placeholder={transkpi("enterReviewerId")}
                      value={form.reviewer_id}
                      onChange={(val) => setForm({ ...form, reviewer_id: String(val) })}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={4}>
                  <FormField
                    label={transkpi("status")}
                    type="select"
                    required
                    options={STATUS_OPTIONS}
                    value={form.status}
                    onChange={(val) => setForm({ ...form, status: String(val) })}
                    error={errors.status}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormField
                    label={transkpi("comments")}
                    type="text"
                    placeholder={transkpi("enterComments")}
                    multiline
                    value={form.comments}
                    onChange={(val) => setForm({ ...form, comments: String(val) })}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default AssigneeDetail;

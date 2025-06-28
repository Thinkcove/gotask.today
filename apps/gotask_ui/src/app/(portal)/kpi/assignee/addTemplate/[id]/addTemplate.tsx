"use client";

import React, { useState } from "react";
import { Box, Grid, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import FormField from "@/app/component/input/formField";
import { KPI_FREQUENCY, STATUS_OPTIONS } from "@/app/common/constants/kpi";
import { createKpiAssignment } from "../../../service/templateAction";
import useSWR from "swr";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";
import { useUser } from "@/app/userContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AlphabetAvatar from "@/app/component/avatar/alphabetAvatar";

interface AddTemplateProps {
  templates: any[];
  userId: string;
  mutate: () => void;
  user: any;
}

const AddTemplate: React.FC<AddTemplateProps> = ({ templates, userId, mutate, user }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const router = useRouter();
  const { data: users = [] } = useSWR("fetch-users", fetcherUserList);
  const { user: loginUser } = useUser();

  const userName = loginUser?.name || "";
  const formattedUserName = userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase();
  const defaultAssignedBy = users.find((u: any) => u.name === formattedUserName)?.name || "";

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [form, setForm] = useState({
    measurement_criteria: "",
    frequency: "",
    weightage: 1,
    target_Value: 0,
    comments: "",
    status: "Active",
    assigned_by: defaultAssignedBy,
    reviewer_id: "",
    saveAs_Template: false
  });

  if (!form.assigned_by && users.length > 0) {
    const foundUser = users.find((u: any) => u.name === formattedUserName);
    if (foundUser && form.assigned_by !== foundUser.name) {
      setForm((prev) => ({ ...prev, assigned_by: foundUser.name }));
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    if (templateId === "create") {
      sessionStorage.setItem("createTemplateReturnToAssignee", "true");
      router.push("/kpi/createTemplate");
      return;
    }

    setSelectedTemplateId(templateId);
    const template = templates.find((tpl) => tpl.id === templateId);
    if (template) {
      setForm({
        measurement_criteria: template.measurement_criteria || "",
        frequency: template.frequency || "",
        weightage: 1,
        target_Value: 0,
        comments: "",
        status: "Active",
        assigned_by: defaultAssignedBy,
        reviewer_id: "",
        saveAs_Template: false
      });
      setOpenForm(true);
    }
  };

  if (typeof window !== "undefined") {
    const newTemplateId = sessionStorage.getItem("newTemplateId");
    if (newTemplateId && !selectedTemplateId && templates.length > 0) {
      const newlyCreated = templates.find((t) => t.id === newTemplateId);
      if (newlyCreated) {
        handleTemplateSelect(newTemplateId);
        sessionStorage.removeItem("newTemplateId");
        sessionStorage.removeItem("createTemplateReturnToAssignee");
      }
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.frequency) newErrors.frequency = transkpi("frequencyerror");
    if (!form.status) newErrors.status = transkpi("statuserror");
    if (!form.weightage) newErrors.weightage = transkpi("weightageerror");
    if (!form.assigned_by) newErrors.assigned_by = transkpi("assignedbyerror");
    if (!form.measurement_criteria) newErrors.measurement_criteria = transkpi("measurementerror");
    if (!form.target_Value) newErrors.target_Value = transkpi("targetvalue");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const assignedByUser = users.find((u: any) => u.name === form.assigned_by);
    const reviewerUser = users.find((u: any) => u.name === form.reviewer_id);

    const payload = {
      user_id: userId,
      template_id: selectedTemplateId === "create" ? undefined : selectedTemplateId,
      ...form,
      assigned_by: assignedByUser?.id,
      reviewer_id: reviewerUser?.id || undefined
    };

    try {
      await createKpiAssignment(payload);
      setOpenForm(false);
      setSelectedTemplateId("");
      mutate();
      router.push(`/kpi/assignee/view/${userId}`);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={2}>
          <ArrowBackIcon
            sx={{ cursor: "pointer", color: "#741B92" }}
            onClick={() => history.back()}
          />
          <AlphabetAvatar userName={user.name} size={48} fontSize={18} />
          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
            {user.role?.name && (
              <Typography variant="body2" color="textSecondary">
                {user.role.name}
              </Typography>
            )}
          </Box>
        </Box>

        {openForm && (
          <Box sx={{ display: "flex", gap: 2, mt: { xs: 2, md: 0 } }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid #741B92",
                textTransform: "none",
                px: 2
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
                fontWeight: "bold"
              }}
              onClick={handleSubmit}
            >
              {transkpi("assign")}
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <FormField
            label={transkpi("assignTemplate")}
            type="select"
            placeholder={transkpi("entertemplate")}
            options={[
              { id: "create", name: `+ ${transkpi("createNewTemplate")}` },
              ...templates.map((template) => ({ id: template.id, name: template.title }))
            ]}
            value={selectedTemplateId}
            onChange={(val) => handleTemplateSelect(String(val))}
          />
        </Grid>

        {openForm && (
          <>
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
                type="select"
                required
                options={users.map((u: any) => ({ id: u.name, name: u.name }))}
                value={form.assigned_by}
                onChange={(val) => setForm({ ...form, assigned_by: String(val) })}
                error={errors.assigned_by}
                disabled
              />
            </Grid>
            {userId === form.assigned_by && (
              <Grid item xs={12} md={4}>
                <FormField
                  label={transkpi("reviewerId")}
                  type="select"
                  options={users.map((u: any) => ({ id: u.name, name: u.name }))}
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
          </>
        )}
      </Grid>
    </Box>
  );
};

export default AddTemplate;

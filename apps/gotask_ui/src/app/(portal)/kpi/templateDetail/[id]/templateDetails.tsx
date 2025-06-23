"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Template } from "../../service/templateInterface";
import { deleteTemplate, updateTemplate } from "../../service/templateAction";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import LabelValueText from "@/app/component/text/labelValueText";
import {
  KPI_FREQUENCY,
  MEASUREMENT_CRITERIA_OPTIONS,
  STATUS_OPTIONS
} from "@/app/common/constants/kpi";
import FormField from "@/app/component/input/formField";

interface TemplateDetailProps {
  template: Template;
  mutate: () => void;
}

const TemplateDetail: React.FC<TemplateDetailProps> = ({ template, mutate }) => {
  const router = useRouter();
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [weightage, setWeightage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [status, setStatus] = useState("");

  const handleBack = () => {
    router.back();
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTemplate(template.id);

      setSnackbarMessage(transkpi("deleteSuccess"));
      setSnackbarSeverity("success");
      setOpenDialog(false);
      setSnackbarOpen(true);
      mutate();
      setTimeout(() => {
        handleBack();
      }, 500);
    } catch (error: any) {
      const status = error?.response?.status;
      const errorMessage =
        status === 500
          ? transkpi("servererror")
          : status === 404
            ? transkpi("notemplate")
            : error.message || transkpi("deleteFailed");
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setOpenDialog(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEditOpen = (template: Template) => {
    setEditTemplate(template);
    setName(template.name);
    setDescription(template.description || "");
    setWeightage(template.weightage);
    setFrequency(template.frequency || "Monthly");
    setStatus(template.status ?? true);
    setError("");
  };

  const handleEditSave = async () => {
    if (!name || !weightage || !frequency || !editTemplate?.id) {
      setError(transkpi("validationerror"));
      return;
    }

    try {
      await updateTemplate(editTemplate.id, {
        name,
        description: description || undefined,
        weightage,
        frequency,
        status
      });
      setEditTemplate(null);
      setName("");
      setDescription("");
      setWeightage("");
      setFrequency("");
      setStatus("");
      setError("");
      mutate();
    } catch (err) {
      setError(transkpi("updateerror"));
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          p: 3,
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            p: 4,
            bgcolor: "#f9fafb",
            border: "1px solid #e0e0e0"
          }}
        >
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton color="primary" onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Typography variant="h4" fontWeight={700} sx={{ textTransform: "capitalize" }}>
                {template.name}
              </Typography>
              <Box>
                <IconButton color="primary" onClick={() => handleEditOpen(template)}>
                  <Edit />
                </IconButton>
                <IconButton color="error" onClick={handleDeleteClick}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Grid container spacing={2} flexDirection="column" mb={2}>
            <Grid item xs={12} md={6}>
              <LabelValueText
                label={transkpi("description")}
                value={template.description || transkpi("nodescription")}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText label={transkpi("weightage")} value={template.weightage} />
            </Grid>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText label={transkpi("frequency")} value={template.frequency || "N/A"} />
            </Grid>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText
                label={transkpi("isActive")}
                value={
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color:
                        template.status === "Active"
                          ? "green"
                          : template.status === "Inactive"
                            ? "gray"
                            : "#C62828"
                    }}
                  >
                    {template.status === "Active"
                      ? transkpi("active")
                      : template.status === "Inactive"
                        ? transkpi("inactive")
                        : transkpi("locked")}
                  </Typography>
                }
              />
            </Grid>
          </Grid>
          <Divider sx={{ mb: 4 }} />
        </Box>
      </Box>
      {editTemplate && (
        <Dialog open={!!editTemplate} onClose={() => setEditTemplate(null)} maxWidth="sm" fullWidth>
          <DialogTitle>{transkpi("edittemplate")}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <FormField
                label={transkpi("name")}
                type="text"
                value={name}
                onChange={(val) => setName(val as string)}
                required
                placeholder={transkpi("name")}
              />

              <FormField
                label={transkpi("description")}
                type="text"
                value={description}
                onChange={(val) => setDescription(val as string)}
                multiline
                placeholder={transkpi("description")}
              />

              <FormField
                label={transkpi("frequency")}
                type="select"
                value={frequency}
                options={Object.values(KPI_FREQUENCY)}
                onChange={(val) => setFrequency(val as string)}
                required
                placeholder={transkpi("selectfrequency")}
              />

              {/* Keep Radio Group as is */}
              <FormControl component="fieldset">
                <FormLabel component="legend">{transkpi("weightage")}</FormLabel>
                <RadioGroup row value={weightage} onChange={(e) => setWeightage(e.target.value)}>
                  {MEASUREMENT_CRITERIA_OPTIONS.map((value) => (
                    <FormControlLabel
                      key={value}
                      value={value}
                      control={<Radio />}
                      label={value.toString()}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <FormField
                label={transkpi("status")}
                type="select"
                value={status}
                options={STATUS_OPTIONS}
                onChange={(val) => setStatus(val as string)}
                required
                placeholder={transkpi("selectstatus")}
              />

              {error && (
                <Typography color="error.main" fontSize="0.875rem">
                  {error}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditTemplate(null)} color="secondary">
              {transkpi("cancel")}
            </Button>
            <Button onClick={handleEditSave} color="primary" variant="contained">
              {transkpi("save")}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <CommonDialog
        open={openDialog}
        onClose={handleDialogClose}
        onSubmit={handleDeleteConfirm}
        title={transkpi("deleteTitle")}
        submitLabel="Delete"
      >
        <Typography variant="body1" color="text.secondary">
          {transkpi("deleteConfirm")}
        </Typography>
      </CommonDialog>
      <CustomSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
  );
};

export default TemplateDetail;

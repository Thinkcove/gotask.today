"use client";
import React, { useState } from "react";
import { Box, Typography, Grid, IconButton, Divider } from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { Template } from "../../service/templateInterface";
import { deleteTemplate } from "../../service/templateAction";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import LabelValueText from "@/app/component/text/labelValueText";
import { getUserStatusColor } from "@/app/common/constants/status";

interface TemplateDetailProps {
  template: Template;
  mutate: () => void;
}

const TemplateDetail: React.FC<TemplateDetailProps> = ({ template, mutate }) => {
  const router = useRouter();
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const handleBack = () => {
    router.push("/kpi");
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
      const errorMessage = error.message || transkpi("deleteFailed");
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setOpenDialog(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEditOpen = () => {
    router.push(`/kpi/editTemplate/${template.id}`);
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
                {template.title}
              </Typography>
              <Box>
                <IconButton color="primary" onClick={handleEditOpen}>
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
              <LabelValueText label={transkpi("weightage")} value={template.measurement_criteria} />
            </Grid>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText label={transkpi("frequency")} value={template.frequency || "N/A"} />
            </Grid>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText
                label={transkpi("status")}
                value={
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color: getUserStatusColor(template.status),
                      textTransform: "capitalize"
                    }}
                  >
                    {transkpi(template.status?.toLowerCase() || "inactive")}
                  </Typography>
                }
              />
            </Grid>
          </Grid>
          <Divider sx={{ mb: 4 }} />
        </Box>
      </Box>
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

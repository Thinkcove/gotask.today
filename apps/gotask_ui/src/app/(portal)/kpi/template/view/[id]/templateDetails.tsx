"use client";
import React, { useState } from "react";
import { Box, Typography, Grid, IconButton, Divider } from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CommonDialog from "@/app/component/dialog/commonDialog";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import LabelValueText from "@/app/component/text/labelValueText";
import { getUserStatusColor } from "@/app/common/constants/status";
import { Template } from "../../../service/templateInterface";
import { deleteTemplate } from "../../../service/templateAction";
import { RichTextReadOnly } from "mui-tiptap";
import { getTipTapExtensions } from "@/app/common/utils/textEditor";

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
    router.push("/kpi/template");
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTemplate(template.id);
      setSnackbarMessage(transkpi("deletesuccess"));
      setSnackbarSeverity("success");
      setOpenDialog(false);
      setSnackbarOpen(true);
      mutate();
      handleBack();
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
    router.push(`/kpi/template/edit/${template.id}`);
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
          {/* Header */}
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

          {/* Description Section */}

          <Grid container spacing={2} flexDirection="column" mb={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                {transkpi("description")}
              </Typography>

              <RichTextReadOnly
                content={template.description || ""}
                extensions={getTipTapExtensions()}
              />
            </Grid>
          </Grid>

          {/* KPI Info Section */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={4} sm={6} md={4}>
              <LabelValueText
                label={transkpi("measurementcriteria")}
                value={template.measurement_criteria || "N/A"}
              />
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

      {/* Delete Confirmation Dialog */}
      <CommonDialog
        open={openDialog}
        onClose={handleDialogClose}
        onSubmit={handleDeleteConfirm}
        title={transkpi("deleteTitle")}
        submitLabel={transkpi("delete")}
        submitColor="#b71c1c"
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

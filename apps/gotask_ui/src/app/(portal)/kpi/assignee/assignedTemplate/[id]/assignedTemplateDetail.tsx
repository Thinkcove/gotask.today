"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, IconButton, Grid, TextField, Button } from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { deleteKpiAssignment, updateKpiAssignment } from "../../../service/templateAction";
import { getUserStatusColor } from "@/app/common/constants/status";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { useUser } from "@/app/userContext";
import EditIcon from "@mui/icons-material/Edit";
import { KpiAssignment } from "../../../service/templateInterface";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface Props {
  assignment: KpiAssignment;
  assignmentId: string;
  mutate: () => void;
  userId: string;
}

const AssignedTemplateDetail: React.FC<Props> = ({ assignment, assignmentId }) => {
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<"success" | "error">("success");

  const handleDelete = async () => {
    try {
      await deleteKpiAssignment(assignment.assignment_id);
      setSnackbarMessage(transkpi("deletesuccessassignment"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        router.push("/kpi/assignee");
      }, 1000);
    } catch (error: any) {
      setSnackbarMessage(error.message || transkpi("deletefailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentText, setCommentText] = useState(
    Array.isArray(assignment.comments)
      ? (assignment.comments[0] ?? "")
      : (assignment.comments ?? "")
  );
  const { user: loginUser } = useUser();

  const handleSaveComment = async () => {
    if (!loginUser?.id) return;
    await updateKpiAssignment(assignment.assignment_id, {
      comments: [commentText],
      authUserId: loginUser.id
    });
    setIsEditingComment(false);
  };

  return (
    <Box sx={{ p: 4, background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)" }}>
      <Box sx={{ borderRadius: 4, p: 4, bgcolor: "#f9fafb", border: "1px solid #e0e0e0" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <IconButton color="primary" onClick={() => router.back()} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" fontWeight={700}>
              {assignment.kpi_Title}
            </Typography>
          </Box>
          <Box>
            <IconButton
              color="primary"
              onClick={() => router.push(`/kpi/assignee/assignedTemplateEdit/${assignmentId}`)}
            >
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={handleDelete}>
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography fontWeight={600}>{transkpi("description")}</Typography>
            <Typography>{assignment.kpi_Description || "N/A"}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography fontWeight={600}>{transkpi("frequency")}</Typography>
            <Typography>{assignment.frequency}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography fontWeight={600}>{transkpi("measurementcriteria")}</Typography>
            <Typography>{assignment.measurement_criteria}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography fontWeight={600}>{transkpi("weightage")}</Typography>
            <Typography>{assignment.weightage ?? "N/A"}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography fontWeight={600}>{transkpi("assignedby")}</Typography>
            <Typography>{assignment.assigned_by}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography fontWeight={600}>{transkpi("reviewerid")}</Typography>
            <Typography>{assignment.reviewer_id || "N/A"}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography fontWeight={600}>{transkpi("status")}</Typography>
            <Typography
              sx={{ color: getUserStatusColor(assignment.status), textTransform: "capitalize" }}
            >
              {assignment.status}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight={600} mb={1}>
              {transkpi("comments")}
            </Typography>

            <Box
              sx={{
                position: "relative",
                border: "1px solid #ccc",
                borderRadius: 2,
                padding: 2,
                minHeight: "120px",
                backgroundColor: "#fafafa"
              }}
            >
              {!isEditingComment ? (
                <>
                  <Typography whiteSpace="pre-line">{commentText || "N/A"}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => setIsEditingComment(true)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "#f0f0f0",
                      "&:hover": { backgroundColor: "#e0e0e0" }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    variant="outlined"
                  />
                  <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={() => setIsEditingComment(false)}>
                      {transkpi("cancel")}
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#741B92" }}
                      onClick={handleSaveComment}
                    >
                      {transkpi("save")}
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
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

export default AssignedTemplateDetail;

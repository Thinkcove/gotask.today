"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton, Grid, TextField, Button, Typography } from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import { deleteKpiAssignment, updateKpiAssignment } from "../../../service/templateAction";
import { getUserStatusColor } from "@/app/common/constants/status";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { User, useUser } from "@/app/userContext";
import EditIcon from "@mui/icons-material/Edit";
import { KpiAssignment } from "../../../service/templateInterface";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import CommonDialog from "@/app/component/dialog/commonDialog";
import LabelValueText from "@/app/component/text/labelValueText";
import useSWR from "swr";
import { fetcherUserList } from "@/app/(portal)/user/services/userAction";
import PerformanceChart from "./performanceChart";
import PerformanceCards from "./performanceCard";
import Toggle from "@/app/component/toggle/toggle";

interface Props {
  assignment: KpiAssignment;
  assignmentId: string;
  mutate: () => void;
  userId: string;
}

const AssignedTemplateDetail: React.FC<Props> = ({ assignment, assignmentId }) => {
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const { data: users = [] } = useSWR("fetch-users", fetcherUserList);

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentText, setCommentText] = useState(
    Array.isArray(assignment.comments)
      ? (assignment.comments[0] ?? "")
      : (assignment.comments ?? "")
  );
  const { user: loginUser } = useUser();
  const [selectedTab, setSelectedTab] = useState<string>(transkpi("general"));
  const [scoreSubTab, setScoreSubTab] = useState<string>(transkpi("previousscores"));

  const getUserNameById = (id: string) => {
    const user = users.find((u: User) => u.id === id);
    return user ? user.name : id;
  };

  const handleDelete = async () => {
    try {
      await deleteKpiAssignment(assignment.assignment_id);
      setSnackbarMessage(transkpi("deletesuccessassignment"));
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenDialog(false);
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error: any) {
      setSnackbarMessage(error.message || transkpi("deletefailed"));
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setOpenDialog(false);
    }
  };

  const handleSaveComment = async () => {
    if (!loginUser?.id) return;
    await updateKpiAssignment(assignment.assignment_id, {
      comments: [commentText],
      authUserId: loginUser.id
    });
    setIsEditingComment(false);
  };

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)",
        minHeight: "100vh",
        height: "100vh",
        overflowY: "auto",
        boxSizing: "border-box"
      }}
    >
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
              onClick={() => router.push(`/kpi/employee/assignedTemplateEdit/${assignmentId}`)}
            >
              <Edit />
            </IconButton>
            <IconButton color="error" onClick={() => setOpenDialog(true)}>
              <Delete />
            </IconButton>
          </Box>
        </Box>

        {/* Main Tabs */}
        <Box sx={{ mb: 3 }}>
          <Toggle
            options={[transkpi("general"), transkpi("score")]}
            selected={selectedTab}
            onChange={setSelectedTab}
          />
        </Box>

        {/* General Tab */}
        {selectedTab === transkpi("general") && (
          <Box sx={{ flex: 1, maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <LabelValueText
                  label={transkpi("description")}
                  value={assignment.kpi_Description || "N/A"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelValueText label={transkpi("frequency")} value={assignment.frequency} />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelValueText
                  label={transkpi("weightage")}
                  value={assignment.weightage ?? "N/A"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelValueText
                  label={transkpi("targetvalue")}
                  value={assignment.target_value || "N/A"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelValueText
                  label={transkpi("assignedby")}
                  value={getUserNameById(assignment.assigned_by)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelValueText
                  label={transkpi("reviewerid")}
                  value={assignment.reviewer_id ? getUserNameById(assignment.reviewer_id) : "N/A"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelValueText
                  label={transkpi("status")}
                  value={assignment.status}
                  sx={{ color: getUserStatusColor(assignment.status), textTransform: "capitalize" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LabelValueText
                  label={transkpi("actualvalue")}
                  value={assignment.actual_value || "N/A"}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {selectedTab === transkpi("score") && (
          <Box sx={{ flex: 1, maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}>
            <Box
              sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <Toggle
                options={[transkpi("previousscores"), transkpi("graph")]}
                selected={scoreSubTab}
                onChange={setScoreSubTab}
              />
              {scoreSubTab === transkpi("previousscores") && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    fontSize: "0.75rem",
                    padding: "4px ",
                    minWidth: "auto"
                  }}
                  onClick={() => router.push(`/kpi/employee/addScore/${assignmentId}`)}
                >
                  {transkpi("addperformancebutton")}
                </Button>
              )}
            </Box>
            {scoreSubTab === transkpi("previousscores") && (
              <Grid item xs={12}>
                <PerformanceCards
                  performance={assignment.performance ?? []}
                  assignmentId={assignment.assignment_id}
                />
              </Grid>
            )}
            {scoreSubTab === transkpi("graph") && (
              <Grid item xs={12}>
                <PerformanceChart
                  performance={assignment.performance ?? []}
                  assignedById={assignment.assigned_by}
                  reviewerId={assignment.reviewer_id}
                  targetValue={Number(assignment.target_value) || 0}
                />
              </Grid>
            )}
          </Box>
        )}
      </Box>

      <CommonDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleDelete}
        title={transkpi("deleteTitle")}
        submitLabel={transkpi("delete")}
      >
        <Typography variant="body1" color="text.secondary">
          {transkpi("deleteConfirmassignment")}
        </Typography>
      </CommonDialog>

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

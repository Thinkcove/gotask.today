"use client";
import React, { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import {
  useIssuesById,
  createAssetIssues,
  useAllIssues,
  useAllAssets
} from "../../services/assetActions";
import IssueInput from "../../createIssues/issuesInput";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { statusOptions } from "../../assetConstants";
import { fetcherUserList } from "../../../user/services/userAction";
import useSWR from "swr";
import { IAssetAttributes, IAssetIssues } from "../../interface/asset";
import { User } from "@/app/(portal)/user/interfaces/userInterface";
import { ArrowBack } from "@mui/icons-material";
import HistoryIcon from "@mui/icons-material/History";
import IssueHistoryDrawer from "../../createIssues/issuesDrawer";

const EditIssue: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const { asset: issueById } = useIssuesById(String(id));
  const { getAll: assets } = useAllAssets();
  const { data: users } = useSWR("fetch-user", fetcherUserList);
  const { mutate: issuesMutate } = useAllIssues();
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string>("");
  const [formData, setFormData] = useState<IAssetIssues | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

  const userOptions = users?.map((u: User) => ({ id: u.id, name: u.name })) || [];
  const assetOptions =
    assets?.map((a: IAssetAttributes) => ({ id: a.id, name: a.deviceName })) || [];

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData?.assetId) errors.assetId = transasset("assets") + " " + transasset("isrequired");
    if (!formData?.reportedBy)
      errors.reportedBy = transasset("reportedby") + " " + transasset("isrequired");
    if (!formData?.issueType)
      errors.issueType = transasset("issuestype") + " " + transasset("isrequired");
    if (!formData?.status) errors.status = transasset("status") + " " + transasset("isrequired");
    if (!formData?.assignedTo)
      errors.assignedTo = transasset("assignedTo") + " " + transasset("isrequired");
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShowHistory = (issueId: string) => {
    setSelectedIssueId(issueId);
    setOpenHistoryDrawer(true);
  };

  useMemo(() => {
    if (!formData && issueById) {
      setFormData(issueById);
    }
  }, [issueById, formData]);

  const handleChange = <K extends keyof IAssetIssues>(key: K, value: IAssetIssues[K]) => {
    setFormData((prev) => ({ ...prev!, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData || !validateForm()) return;
    try {
      const updatedFields: Partial<IAssetIssues> = {};

      const compareAndUpdate = <K extends keyof IAssetIssues>(key: K) => {
        if (formData[key] !== issueById?.[key]) {
          updatedFields[key] = formData[key];
        }
      };

      compareAndUpdate("status");

      if (Object.keys(updatedFields).length === 0) {
        setSnackbar({
          open: true,
          message: transasset("noupdates"),
          severity: SNACKBAR_SEVERITY.INFO
        });
        return;
      }

      updatedFields.previousStatus = issueById?.status;

      const response = await createAssetIssues({ ...formData, ...updatedFields });
      if (response.success) {
        await issuesMutate();
        setSnackbar({
          open: true,
          message: transasset("issuesupdated"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
        router.push("/asset/issues");
      }
    } catch (error) {
      console.error("Issue update failed", error);
      setSnackbar({
        open: true,
        message: transasset("issueserror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    }
  };

  if (!formData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #f9f9fb, #ffffff)"
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            textAlign: "center"
          }}
        >
          <CircularProgress size={50} thickness={4} />
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", sm: "flex-start" },
                  gap: 0.5
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton color="primary" onClick={() => router.back()}>
                    <ArrowBack sx={{ color: "#741B92" }} />
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#741B92" }}>
                    {transasset("editissue")}
                  </Typography>
                </Box>

                {/* Show History */}
                {!!issueById?.issuesHistory?.length && (
                  <Box
                    onClick={() => handleShowHistory(issueById.id!)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "#741B92",
                      cursor: "pointer",
                      textDecoration: "underline",
                      pl: { xs: 3, sm: 6 }
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, textDecoration: "underline" }}
                    >
                      {transasset("showhistory")}
                    </Typography>
                    <HistoryIcon fontSize="small" />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Buttons */}
            <Grid
              item
              xs={12}
              sm={6}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 2,
                mt: { xs: 1, sm: 0 }
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "30px",
                  color: "#741B92",
                  border: "2px solid #741B92",
                  px: 2,
                  textTransform: "none",
                  fontWeight: "bold"
                }}
                onClick={() => router.back()}
              >
                {transasset("cancel")}
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
                {transasset("update")}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <IssueInput
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={false}
          userOptions={userOptions}
          assetOptions={assetOptions}
          statusOptions={statusOptions}
          errors={fieldErrors}
          disabledFields={["assetId", "reportedBy", "issueType", "description", "assignedTo"]}
        />
      </Grid>
      {openHistoryDrawer && issueById?.issuesHistory && selectedIssueId && (
        <IssueHistoryDrawer
          open={openHistoryDrawer}
          onClose={() => setOpenHistoryDrawer(false)}
          history={issueById.issuesHistory}
        />
      )}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default EditIssue;

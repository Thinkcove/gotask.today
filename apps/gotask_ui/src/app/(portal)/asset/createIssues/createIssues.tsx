"use client";
import React, { useState, useMemo } from "react";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import useSWR from "swr";
import { useAllAssets, useAllIssues, createAssetIssues } from "../services/assetActions";
import { fetcherUserList } from "../../user/services/userAction";
import { IAssetAttributes, IAssetIssues } from "../interface/asset";
import { User } from "../../user/interfaces/userInterface";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { statusOptions } from "../assetConstants";
import { useRouter } from "next/navigation";
import IssueInput from "./issuesInput";
import { useUser } from "@/app/userContext";

const initialData: IAssetIssues = {
  assetId: "",
  reportedBy: "",
  issueType: "",
  description: "",
  status: "Open",
  assignedTo: "",
  comment: "",
  updatedBy: ""
};

const CreateIssue: React.FC = () => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const router = useRouter();
  const { user } = useUser();

  const [formData, setFormData] = useState<IAssetIssues>({
    ...initialData,
    reportedBy: user?.id || ""
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [loading, setLoading] = useState(false);

  const { data: users } = useSWR("fetch-user", fetcherUserList);
  const { getAll: assets, isLoading } = useAllAssets();
  const { mutate: issuesMutate } = useAllIssues();

  const userOptions = useMemo(
    () => users?.map((u: User) => ({ id: u.id, name: u.name })) || [],
    [users]
  );

  const assetOptions = useMemo(
    () =>
      assets
        ?.filter((a: IAssetAttributes) => a.deviceName && a.deviceName.trim() !== "")
        .map((a: IAssetAttributes) => ({ id: a.id, name: a.deviceName })) || [],
    [assets]
  );

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.assetId) errors.assetId = `${transasset("assets")} ${transasset("isrequired")}`;
    if (!formData.reportedBy)
      errors.reportedBy = `${transasset("reportedby")} ${transasset("isrequired")}`;
    if (!formData.issueType)
      errors.issueType = `${transasset("issuestype")} ${transasset("isrequired")}`;
    if (!formData.status) errors.status = `${transasset("status")} ${transasset("isrequired")}`;
    if (!formData.assignedTo)
      errors.assignedTo = `${transasset("assignedTo")} ${transasset("isrequired")}`;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = <K extends keyof IAssetIssues>(key: K, value: IAssetIssues[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await createAssetIssues(formData);
      if (res.success) {
        await issuesMutate();
        setSnackbar({
          open: true,
          message: transasset("issuessuccess"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
        router.push("/asset/issues");
      }
    } catch (error) {
      console.error("Create issue error:", error);
      setSnackbar({
        open: true,
        message: transasset("issueserror"),
        severity: SNACKBAR_SEVERITY.ERROR
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh"
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#741B92" }}>
          {transasset("createissue")}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              sx={{
                borderRadius: "30px",
                color: "black",
                border: "2px solid  #741B92",
                px: 2,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)"
                }
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
              {transasset("create")}
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid item xs={12}>
        <IssueInput
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          userOptions={userOptions}
          assetOptions={assetOptions}
          statusOptions={statusOptions}
          errors={fieldErrors}
        />
      </Grid>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
};

export default CreateIssue;

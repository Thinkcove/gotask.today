"use client";
import React, { useState, useMemo } from "react";
import { Box, Grid, Button } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useAllAssets, useAllIssues } from "../services/assetActions";
import useSWR from "swr";
import { fetcherUserList } from "../../user/services/userAction";
import { createAssetIssues } from "../services/assetActions";
import { IAssetAttributes, IAssetIssues } from "../interface/asset";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { User } from "../../user/interfaces/userInterface";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

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

const CreateIssue: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<IAssetIssues>(initialData);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });
  const [loading, setLoading] = useState(false);
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const { data: users } = useSWR("fetch-user", fetcherUserList);
  const { getAll: assets } = useAllAssets();
  const { mutate: issuesMutate } = useAllIssues();

  const userOptions = useMemo(
    () => users?.map((user: User) => ({ id: user.id, name: user.name })) || [],
    [users]
  );
  const assetOptions = useMemo(
    () =>
      assets?.map((asset: IAssetAttributes) => ({ id: asset.id, name: asset.deviceName })) || [],
    [assets]
  );

  const statusOptions = [
    { id: "Open", name: "Open" },
    { id: "InProgress", name: "In Progress" },
    { id: "Resolved", name: "Resolved" }
  ];

  const handleChange = <K extends keyof IAssetIssues>(key: K, value: IAssetIssues[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await createAssetIssues(formData);
      if (res.success) {
        await issuesMutate();
        setSnackbar({
          open: true,
          message: "Issue created successfully",
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
        onClose();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Error creating issue",
        severity: SNACKBAR_SEVERITY.ERROR
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormField
            type="select"
            label={transasset("assets")}
            options={assetOptions}
            placeholder={transasset("assets")}
            value={formData.assetId}
            onChange={(v) => handleChange("assetId", String(v))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            type="select"
            label={transasset("reportedby")}
            placeholder={transasset("reportedby")}
            options={userOptions}
            value={formData.reportedBy}
            onChange={(v) => handleChange("reportedBy", String(v))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            type="text"
            label={transasset("issuestype")}
            placeholder={transasset("issuestype")}
            value={formData.issueType}
            onChange={(v) => handleChange("issueType", String(v))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            type="text"
            label={transasset("description")}
            placeholder={transasset("description")}
            value={formData.description}
            onChange={(v) => handleChange("description", String(v))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            type="select"
            label={transasset("status")}
            placeholder={transasset("status")}
            options={statusOptions}
            value={formData.status}
            onChange={(v) => handleChange("status", String(v))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            type="select"
            label={transasset("assignedTo")}
            placeholder={transasset("assignedTo")}
            options={userOptions}
            value={formData.assignedTo}
            onChange={(v) => handleChange("assignedTo", String(v))}
          />
        </Grid>
      </Grid>

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} fullWidth>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default CreateIssue;

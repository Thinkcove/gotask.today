"use client";
import React, { useState, useMemo } from "react";
import { Box } from "@mui/material";
import useSWR from "swr";
import CustomSnackbar from "@/app/component/snackBar/snackbar";
import { useAllAssets, useAllIssues } from "../services/assetActions";
import { fetcherUserList } from "../../user/services/userAction";
import { createAssetIssues } from "../services/assetActions";
import { IAssetAttributes, IAssetIssues } from "../interface/asset";
import { User } from "../../user/interfaces/userInterface";
import { SNACKBAR_SEVERITY } from "@/app/common/constants/snackbar";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { statusOptions } from "../assetConstants";
import IssueInput from "./issuesInput";
import CommonDialog from "@/app/component/dialog/commonDialog";

interface CreateIssueProps {
  onClose: () => void;
  open: boolean;
}

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

const CreateIssue: React.FC<CreateIssueProps> = ({ onClose, open }) => {
  const [formData, setFormData] = useState<IAssetIssues>(initialData);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: SNACKBAR_SEVERITY.INFO
  });

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
          message: transasset("issuessuccess"),
          severity: SNACKBAR_SEVERITY.SUCCESS
        });
        onClose();
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

  return (
    <Box sx={{ p: 2 }}>
      <CommonDialog
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        title={transasset("createissue")}
      >
        <IssueInput
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          userOptions={userOptions}
          assetOptions={assetOptions}
          statusOptions={statusOptions}
        />
      </CommonDialog>

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

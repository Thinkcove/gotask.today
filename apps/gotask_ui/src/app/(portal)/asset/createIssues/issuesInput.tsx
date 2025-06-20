"use client";
import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { IAssetIssues } from "../interface/asset";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface IssueInputProps {
  formData: IAssetIssues;
  onChange: <K extends keyof IAssetIssues>(field: K, value: IAssetIssues[K]) => void;
  onSubmit: () => void;
  loading: boolean;
  userOptions: { id: string; name: string }[];
  assetOptions: { id: string; name: string }[];
  statusOptions: { id: string; name: string }[];
}

const IssueInput: React.FC<IssueInputProps> = ({
  formData,
  onChange,
  userOptions,
  assetOptions,
  statusOptions
}) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormField
            type="select"
            label={transasset("assets")}
            options={assetOptions}
            placeholder={transasset("assets")}
            value={formData.assetId}
            onChange={(v) => onChange("assetId", String(v))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            type="select"
            label={transasset("reportedby")}
            placeholder={transasset("reportedby")}
            options={userOptions}
            value={formData.reportedBy}
            onChange={(v) => onChange("reportedBy", String(v))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            type="text"
            label={transasset("issuestype")}
            placeholder={transasset("issuestype")}
            value={formData.issueType}
            onChange={(v) => onChange("issueType", String(v))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            type="text"
            label={transasset("description")}
            placeholder={transasset("description")}
            value={formData.description}
            onChange={(v) => onChange("description", String(v))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            type="select"
            label={transasset("status")}
            placeholder={transasset("status")}
            options={statusOptions}
            value={formData.status}
            onChange={(v) => onChange("status", String(v))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormField
            type="select"
            label={transasset("assignedTo")}
            placeholder={transasset("assignedTo")}
            options={userOptions}
            value={formData.assignedTo}
            onChange={(v) => onChange("assignedTo", String(v))}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default IssueInput;

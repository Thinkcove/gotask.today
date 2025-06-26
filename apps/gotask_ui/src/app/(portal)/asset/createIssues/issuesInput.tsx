"use client";
import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { IAssetIssues } from "../interface/asset";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { commonIssueTypes } from "../assetConstants";
import { useUser } from "@/app/userContext";

interface IssueInputProps {
  formData: IAssetIssues;
  onChange: <K extends keyof IAssetIssues>(field: K, value: IAssetIssues[K]) => void;
  onSubmit: () => void;
  loading: boolean;
  userOptions: { id: string; name: string }[];
  assetOptions: { id: string; name: string }[];
  statusOptions: { id: string; name: string }[];
  errors?: { [key: string]: string };
  disabledFields?: (keyof IAssetIssues)[];
}

const IssueInput: React.FC<IssueInputProps> = ({
  formData,
  onChange,
  userOptions,
  assetOptions,
  statusOptions,
  errors,
  disabledFields
}) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  const { user } = useUser();
  const autoFillReporter = !formData.reportedBy && user?.id;
  if (autoFillReporter) onChange("reportedBy", user.id);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <FormField
            type="select"
            label={`${transasset("assets")} ${transasset("required")}`}
            options={assetOptions}
            placeholder={transasset("assets")}
            value={formData.assetId}
            onChange={(val) => onChange("assetId", String(val))}
            error={errors?.assetId}
            disabled={disabledFields?.includes("assetId")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormField
            type="select"
            label={`${transasset("reportedby")} ${transasset("required")}`}
            placeholder={transasset("reportedby")}
            options={userOptions}
            value={formData.reportedBy}
            error={errors?.reportedBy}
            onChange={(val) => onChange("reportedBy", String(val))}
            disabled={disabledFields?.includes("reportedBy")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormField
            type="select"
            label={`${transasset("issuestype")} ${transasset("required")}`}
            placeholder={transasset("issuestype")}
            options={commonIssueTypes}
            value={formData.issueType}
            error={errors?.issueType}
            onChange={(val) => onChange("issueType", String(val))}
            disabled={disabledFields?.includes("issueType")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormField
            type="text"
            label={transasset("description")}
            placeholder={transasset("description")}
            value={formData.description}
            onChange={(val) => onChange("description", String(val))}
            disabled={disabledFields?.includes("description")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormField
            type="select"
            label={`${transasset("status")} ${transasset("required")}`}
            placeholder={transasset("status")}
            options={statusOptions}
            value={formData.status}
            error={errors?.status}
            onChange={(val) => onChange("status", String(val))}
            disabled={disabledFields?.includes("status")}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <FormField
            type="select"
            label={`${transasset("assignedTo")} ${transasset("required")}`}
            placeholder={transasset("assignedTo")}
            options={userOptions}
            value={formData.assignedTo}
            error={errors?.assignedTo}
            onChange={(val) => onChange("assignedTo", String(val))}
            disabled={disabledFields?.includes("assignedTo")}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default IssueInput;

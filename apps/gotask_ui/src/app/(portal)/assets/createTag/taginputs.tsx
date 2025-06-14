"use client";
import React from "react";
import { Box, Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { IAssetTags } from "../interface/asset";

interface AssetTagDrawerFormProps {
  formData: any;
  onChange: <K extends keyof IAssetTags>(field: K, value: IAssetTags[K]) => void;
  userOptions: { id: string; name: string }[];
  assetOptions: { id: string; name: string }[];
  previousUserOptions: { id: string; name: string }[];
  actionTypes: { id: string; name: string }[];
}

const TagInput: React.FC<AssetTagDrawerFormProps> = ({
  formData,
  onChange,
  userOptions,
  assetOptions,
  previousUserOptions,
  actionTypes
}) => {
  console.log("userOptions", userOptions);
  const trans = useTranslations(LOCALIZATION.TRANSITION.ASSETS);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormField
            label={trans("assignedTo")}
            type="select"
            options={userOptions}
            value={formData.userId || ""}
            onChange={(val) => onChange("userId", String(val))}
            placeholder={trans("assignedTo")}
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            label={trans("assettype")}
            type="select"
            options={assetOptions}
            value={formData.assetId || ""}
            onChange={(val) => onChange("assetId", String(val))}
            placeholder={trans("assettype")}
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            label={trans("actionType")}
            type="select"
            options={actionTypes}
            value={formData.actionType || ""}
            onChange={(val) => onChange("actionType", String(val))}
            placeholder={trans("actionType")}
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            label={trans("recoveryKey")}
            type="text"
            value={formData.erk || ""}
            onChange={(val) => onChange("erk", String(val))}
            placeholder={trans("recoveryKey")}
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            label={trans("previouslyUsedBy")}
            type="select"
            options={previousUserOptions}
            value={formData.previouslyUsedBy || ""}
            onChange={(val) => onChange("previouslyUsedBy", String(val))}
            placeholder={trans("previouslyUsedBy")}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TagInput;

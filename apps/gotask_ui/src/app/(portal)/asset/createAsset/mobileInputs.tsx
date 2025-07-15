// MobileInputs.tsx
import React from "react";
import { Grid, Typography } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { IAssetAttributes } from "../interface/asset";
import ReusableEditor from "@/app/component/richText/textEditor";

interface MobileInputsProps {
  formData: IAssetAttributes;
  onChange: <K extends keyof IAssetAttributes>(field: K, value: IAssetAttributes[K]) => void;
  errors?: { [key: string]: string };
  systemTypeOptions: string[];
}

const MobileInputs: React.FC<MobileInputsProps> = ({
  formData,
  onChange,
  errors,
  systemTypeOptions
}) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <FormField
          label={`${transasset("systemtype")} ${transasset("required")}`}
          type="select"
          placeholder={transasset("systemtype")}
          value={formData.systemType}
          error={errors?.systemtype}
          required
          options={systemTypeOptions}
          onChange={(val) => onChange("systemType", String(val))}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <FormField
          label={`${transasset("imeiNumber")} ${transasset("required")}`}
          type="text"
          value={formData.imeiNumber}
          error={errors?.imeiNumber}
          placeholder={transasset("imeiNumber")}
          onChange={(val) => onChange("imeiNumber", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("screenSize")}
          type="text"
          placeholder={transasset("screenSize")}
          value={formData.screenSize}
          onChange={(val) => onChange("screenSize", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("batteryCapacity")}
          type="text"
          placeholder={transasset("batteryCapacity")}
          value={formData.batteryCapacity}
          onChange={(val) => onChange("batteryCapacity", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("cameraSpecs")}
          type="text"
          placeholder={transasset("cameraSpecs")}
          value={formData.cameraSpecs}
          onChange={(val) => onChange("cameraSpecs", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("simType")}
          type="text"
          placeholder={transasset("simType")}
          value={formData.simType}
          onChange={(val) => onChange("simType", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("insuranceProvider")}
          type="text"
          placeholder={transasset("insuranceProvider")}
          value={formData.insuranceProvider}
          onChange={(val) => onChange("insuranceProvider", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("insurancePolicyNumber")}
          type="text"
          placeholder={transasset("insurancePolicyNumber")}
          value={formData.insurancePolicyNumber}
          onChange={(val) => onChange("insurancePolicyNumber", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("insuranceExpiry")}
          type="date"
          placeholder={transasset("insuranceExpiry")}
          value={formData.insuranceExpiry}
          onChange={(val) => onChange("insuranceExpiry", new Date(val as string))}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          {transasset("description")}
        </Typography>
        <ReusableEditor
          content={formData.commentService || ""}
          onChange={(html) => onChange("commentService", html)}
          placeholder={transasset("description")}
          readOnly={false}
          showSaveButton={false}
        />
      </Grid>
    </Grid>
  );
};

export default MobileInputs;

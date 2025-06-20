// MobileInputs.tsx
import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { IAssetAttributes } from "../interface/asset";

interface MobileInputsProps {
  formData: IAssetAttributes;
  onChange: <K extends keyof IAssetAttributes>(field: K, value: IAssetAttributes[K]) => void;
  errors?: { [key: string]: string };
}

const MobileInputs: React.FC<MobileInputsProps> = ({ formData, onChange, errors }) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("imeiNumber")}
          type="text"
          value={formData.imeiNumber}
          error={errors?.imeiNumber}
          onChange={(val) => onChange("imeiNumber", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("screenSize")}
          type="text"
          value={formData.screenSize}
          onChange={(val) => onChange("screenSize", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("batteryCapacity")}
          type="text"
          value={formData.batteryCapacity}
          onChange={(val) => onChange("batteryCapacity", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("cameraSpecs")}
          type="text"
          value={formData.cameraSpecs}
          onChange={(val) => onChange("cameraSpecs", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("simType")}
          type="text"
          value={formData.simType}
          onChange={(val) => onChange("simType", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("insuranceProvider")}
          type="text"
          value={formData.insuranceProvider}
          onChange={(val) => onChange("insuranceProvider", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("insurancePolicyNumber")}
          type="text"
          value={formData.insurancePolicyNumber}
          onChange={(val) => onChange("insurancePolicyNumber", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transasset("insuranceExpiry")}
          type="date"
          value={formData.insuranceExpiry}
          onChange={(val) => onChange("insuranceExpiry", new Date(val as string))}
        />
      </Grid>
    </Grid>
  );
};

export default MobileInputs;

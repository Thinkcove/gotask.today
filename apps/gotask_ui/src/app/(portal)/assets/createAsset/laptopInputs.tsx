// LaptopInputs.tsx
import React from "react";
import { Box, Checkbox, FormControlLabel, Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { IAssetAttributes } from "../interface/asset";

interface LaptopInputsProps {
  formData: IAssetAttributes;
  onChange: <K extends keyof IAssetAttributes>(field: K, value: IAssetAttributes[K]) => void;
  startIndex?: number;
  errors?: { [key: string]: string };
}

const LaptopInputs: React.FC<LaptopInputsProps> = ({ formData, errors, onChange }) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  return (
    <>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("devicename")}
              type="text"
              placeholder={transasset("devicename")}
              value={formData.deviceName}
              error={errors?.deviceName}
              required
              onChange={(val) => onChange("deviceName", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("serialnumber")}
              type="text"
              placeholder={transasset("serialnumber")}
              value={formData.serialNumber}
              onChange={(val) => onChange("serialNumber", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("modelname")}
              type="text"
              error={errors?.modelName}
              placeholder={transasset("modelname")}
              value={formData.modelName}
              onChange={(val) => onChange("modelName", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("os")}
              type="text"
              error={errors?.os}
              placeholder={transasset("os")}
              value={formData.os}
              onChange={(val) => onChange("os", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("ram")}
              type="text"
              error={errors?.ram}
              placeholder={transasset("ram")}
              value={formData.ram}
              onChange={(val) => onChange("ram", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("storage")}
              type="text"
              error={errors?.storage}
              placeholder={transasset("storage")}
              value={formData.storage}
              onChange={(val) => onChange("storage", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("processor")}
              type="text"
              error={errors?.processor}
              placeholder={transasset("processor")}
              value={formData.processor}
              onChange={(val) => onChange("processor", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("seller")}
              type="text"
              placeholder={transasset("seller")}
              value={formData.seller}
              onChange={(val) => onChange("seller", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("dateOfPurchase")}
              type="date"
              placeholder={transasset("dateOfPurchase")}
              value={formData.dateOfPurchase}
              onChange={(val) => onChange("dateOfPurchase", new Date(val as string))}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("encryptedkey")}
              type="text"
              placeholder={transasset("encryptedkey")}
              value={formData.erk}
              onChange={(val) => onChange("erk", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("warrantyPeriod")}
              type="text"
              placeholder={transasset("warrantyPeriod")}
              value={formData.warrantyPeriod}
              onChange={(val) => onChange("warrantyPeriod", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("warrantyDate")}
              type="date"
              placeholder={transasset("warrantyDate")}
              value={formData.warrantyDate}
              onChange={(val) => onChange("warrantyDate", new Date(val as string))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("antivirus")}
              type="text"
              placeholder={transasset("antivirus")}
              value={formData.antivirus}
              onChange={(val) => onChange("antivirus", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("recoveryKey")}
              type="text"
              placeholder={transasset("recoveryKey")}
              value={formData.recoveryKey}
              onChange={(val) => onChange("recoveryKey", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("lastServicedDate")}
              type="date"
              placeholder={transasset("lastServicedDate")}
              value={formData.lastServicedDate}
              onChange={(val) => onChange("lastServicedDate", new Date(val as string))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label={transasset("commentService")}
              type="text"
              placeholder={transasset("commentService")}
              value={formData.commentService}
              onChange={(val) => onChange("commentService", String(val))}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isEncrypted}
                  onChange={(e) => onChange("isEncrypted", e.target.checked)}
                />
              }
              label={transasset("isencrypted")}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LaptopInputs;

// LaptopInputs.tsx
import React from "react";
import { Box, Checkbox, FormControlLabel, Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { IAssetAttributes, IAssetType } from "../interface/asset";
import { ASSET_TYPE } from "@/app/common/constants/asset";

interface LaptopInputsProps {
  formData: IAssetAttributes;
  onChange: <K extends keyof IAssetAttributes>(field: K, value: IAssetAttributes[K]) => void;
  startIndex?: number;
  errors?: { [key: string]: string };
  selectedAssetType?: IAssetType;
  systemTypeOptions: string[];
}

const LaptopInputs: React.FC<LaptopInputsProps> = ({
  formData,
  errors,
  onChange,
  selectedAssetType,
  systemTypeOptions
}) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  return (
    <>
      <Box>
        <Grid container spacing={2}>
          {(selectedAssetType?.name === ASSET_TYPE.LAPTOP ||
            selectedAssetType?.name === ASSET_TYPE.MOBILE) && (
            <>
              <Grid item xs={12} sm={4}>
                <FormField
                  label={`${transasset("devicename")} ${transasset("required")}`}
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
                  label={`${transasset("modelname")} ${transasset("required")}`}
                  type="text"
                  error={errors?.modelName}
                  placeholder={transasset("modelname")}
                  value={formData.modelName}
                  onChange={(val) => onChange("modelName", String(val))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormField
                  label={`${transasset("os")} ${transasset("required")}`}
                  type="text"
                  error={errors?.os}
                  placeholder={transasset("os")}
                  value={formData.os}
                  onChange={(val) => onChange("os", String(val))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormField
                  label={`${transasset("ram")} ${transasset("required")}`}
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
                  placeholder={transasset("storage")}
                  value={formData.storage}
                  onChange={(val) => onChange("storage", String(val))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormField
                  label={`${transasset("processor")} ${transasset("required")}`}
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
                  onChange={(val) =>
                    onChange(
                      "dateOfPurchase",
                      val instanceof Date ? val.toISOString().split("T")[0] : String(val)
                    )
                  }
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
                  onChange={(val) =>
                    onChange(
                      "warrantyDate",
                      val instanceof Date ? val.toISOString().split("T")[0] : String(val)
                    )
                  }
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
            </>
          )}
          {selectedAssetType?.name === ASSET_TYPE.LAPTOP && (
            <>
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
                  onChange={(val) =>
                    onChange(
                      "lastServicedDate",
                      val instanceof Date ? val.toISOString().split("T")[0] : String(val)
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormField
                  label={transasset("description")}
                  type="text"
                  placeholder={transasset("description")}
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
            </>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default LaptopInputs;

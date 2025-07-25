import React from "react";
import { Box, Grid, FormControlLabel, Checkbox, Typography } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { IAssetAttributes, IAssetType } from "../interface/asset";
import { ASSET_TYPE } from "@/app/common/constants/asset";
import { authenticationModesOptions } from "../assetConstants";
import ReusableEditor from "@/app/component/richText/textEditor";

interface FingerprintScannerInputsProps {
  formData: IAssetAttributes;
  onChange: <K extends keyof IAssetAttributes>(field: K, value: IAssetAttributes[K]) => void;
  errors?: { [key: string]: string };
  selectedAssetType?: IAssetType;
}

const FingerprintScannerInputs: React.FC<FingerprintScannerInputsProps> = ({
  formData,
  onChange,
  errors,
  selectedAssetType
}) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);

  if (selectedAssetType?.name !== ASSET_TYPE.FINGERPRINT_SCANNER) return null;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormField
            label={`${transasset("devicename")} ${transasset("required")}`}
            type="text"
            value={formData.deviceName}
            placeholder={transasset("devicename")}
            error={errors?.deviceName}
            onChange={(val) => onChange("deviceName", String(val))}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            label={`${transasset("modelname")} ${transasset("required")}`}
            type="text"
            value={formData.modelName}
            placeholder={transasset("modelname")}
            error={errors?.modelName}
            onChange={(val) => onChange("modelName", String(val))}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("capacity")}
            type="text"
            value={formData.capacity}
            placeholder={transasset("capacity")}
            onChange={(val) => onChange("capacity", String(val))}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("location")}
            type="text"
            placeholder={transasset("location")}
            value={formData.Location}
            onChange={(val) => onChange("Location", String(val))}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("connectivity")}
            type="text"
            value={formData.connectivity}
            placeholder={transasset("connectivity")}
            onChange={(val) => onChange("connectivity", String(val))}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("authenticationmodes")}
            type="select"
            options={authenticationModesOptions.map((mode) => ({ id: mode, name: mode }))}
            value={formData.authenticationModes}
            placeholder={transasset("authenticationmodes")}
            onChange={(val) => onChange("authenticationModes", String(val))}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("display")}
            type="text"
            value={formData.display}
            placeholder={transasset("display")}
            onChange={(val) => onChange("display", String(val))}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("seller")}
            type="text"
            value={formData.seller}
            placeholder={transasset("seller")}
            onChange={(val) => onChange("seller", String(val))}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("dateOfPurchase")}
            type="date"
            value={formData.dateOfPurchase}
            placeholder={transasset("dateOfPurchase")}
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
            value={formData.warrantyPeriod}
            placeholder={transasset("warrantyPeriod")}
            onChange={(val) => onChange("warrantyPeriod", String(val))}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("warrantyDate")}
            type="date"
            value={formData.warrantyDate}
            placeholder={transasset("warrantyDate")}
            onChange={(val) =>
              onChange(
                "warrantyDate",
                val instanceof Date ? val.toISOString().split("T")[0] : String(val)
              )
            }
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.cloudAndAppBased || false}
                onChange={(e) => onChange("cloudAndAppBased", e.target.checked)}
              />
            }
            label={transasset("cloudandappbased")}
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
    </Box>
  );
};

export default FingerprintScannerInputs;

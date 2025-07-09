import React from "react";
import { Box, Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { IAssetAttributes, IAssetType } from "../interface/asset";
import { ASSET_TYPE } from "@/app/common/constants/asset";

interface PrinterInputsProps {
  formData: IAssetAttributes;
  onChange: <K extends keyof IAssetAttributes>(field: K, value: IAssetAttributes[K]) => void;
  errors?: { [key: string]: string };
  selectedAssetType?: IAssetType;
}

const PrinterInputs: React.FC<PrinterInputsProps> = ({
  formData,
  onChange,
  errors,
  selectedAssetType
}) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);

  if (selectedAssetType?.name !== ASSET_TYPE.PRINTER) return null;

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
          <FormField
            label={transasset("location")}
            type="text"
            value={formData.Location}
            placeholder={transasset("location")}
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
            label={transasset("printerType")}
            type="text"
            value={formData.printerType}
            placeholder={transasset("printerType")}
            onChange={(val) => onChange("printerType", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("specialFeatures")}
            type="text"
            value={formData.specialFeatures}
            placeholder={transasset("specialFeatures")}
            onChange={(val) => onChange("specialFeatures", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("printerOutputType")}
            type="text"
            value={formData.printerOutputType}
            placeholder={transasset("printerOutputType")}
            onChange={(val) => onChange("printerOutputType", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("supportedPaperSizes")}
            type="text"
            value={formData.supportedPaperSizes}
            placeholder={transasset("supportedPaperSizes")}
            onChange={(val) => onChange("supportedPaperSizes", String(val))}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrinterInputs;

import React from "react";
import { Box, Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { IAssetAttributes, IAssetType } from "../interface/asset";
import { ASSET_TYPE } from "@/app/common/constants/asset";
import { connectivityOptions, locationOptions } from "../assetConstants";

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
            type="select"
            placeholder={transasset("location")}
            options={locationOptions.map((loc) => ({ id: loc, name: loc }))}
            value={formData.Location}
            onChange={(val) => onChange("Location", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("connectivity")}
            type="multiselect"
            placeholder={transasset("connectivity")}
            options={connectivityOptions}
            value={formData.connectivity?.split(",").map((c) => c.trim()) || []}
            onChange={(val) => onChange("connectivity", (val as string[]).join(", "))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("printertype")}
            type="text"
            value={formData.printerType}
            placeholder={transasset("printertype")}
            onChange={(val) => onChange("printerType", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("specialfeatures")}
            type="text"
            value={formData.specialFeatures}
            placeholder={transasset("specialfeatures")}
            onChange={(val) => onChange("specialFeatures", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("printeroutputtype")}
            type="text"
            value={formData.printerOutputType}
            placeholder={transasset("printeroutputtype")}
            onChange={(val) => onChange("printerOutputType", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("supportedpapersizes")}
            type="text"
            value={formData.supportedPaperSizes}
            placeholder={transasset("supportedpapersizes")}
            onChange={(val) => onChange("supportedPaperSizes", String(val))}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PrinterInputs;

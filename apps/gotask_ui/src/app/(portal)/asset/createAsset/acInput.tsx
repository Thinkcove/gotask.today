import React from "react";
import { Grid, Box } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { IAssetAttributes, IAssetType } from "../interface/asset";
import { capacityOptions, energyRatingOptions, typeOptions } from "../assetConstants";

interface ACInputsProps {
  formData: IAssetAttributes;
  onChange: <K extends keyof IAssetAttributes>(field: K, value: IAssetAttributes[K]) => void;
  errors?: { [key: string]: string };
  selectedAssetType?: IAssetType;
}

const ACInputs: React.FC<ACInputsProps> = ({ formData, onChange, errors }) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);

  return (
    <Box>
      <Grid container spacing={2}>
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
            label={`${transasset("modelname")} ${transasset("required")}`}
            type="text"
            value={formData.modelName}
            error={errors?.modelName}
            placeholder={transasset("modelname")}
            required
            onChange={(val) => onChange("modelName", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("seller")}
            placeholder={transasset("seller")}
            type="text"
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
            label={transasset("lastServicedDate")}
            type="date"
            value={formData.lastServicedDate}
            placeholder={transasset("lastServicedDate")}
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
            label={transasset("location")}
            type="text"
            placeholder={transasset("location")}
            value={formData.Location}
            onChange={(val) => onChange("Location", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("capacity")}
            type="select"
            placeholder={transasset("capacity")}
            options={capacityOptions.map((accapacity) => ({ id: accapacity, name: accapacity }))}
            value={formData.capacity}
            onChange={(val) => onChange("capacity", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("type")}
            type="select"
            placeholder={transasset("type")}
            options={typeOptions.map((actype) => ({ id: actype, name: actype }))}
            value={formData.acType}
            onChange={(val) => onChange("acType", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("energyrating")}
            type="select"
            placeholder={transasset("energyrating")}
            options={energyRatingOptions.map((energy) => ({ id: energy, name: energy }))}
            value={formData.energyRating}
            onChange={(val) => onChange("energyRating", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("powerconsumption")}
            type="text"
            placeholder={transasset("powerconsumption")}
            value={formData.powerConsumption}
            onChange={(val) => onChange("powerConsumption", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("coolingcoverage")}
            type="text"
            placeholder={transasset("coolingcoverage")}
            value={formData.coolingCoverage}
            onChange={(val) => onChange("coolingCoverage", String(val))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transasset("invertertype")}
            type="text"
            placeholder={transasset("invertertype")}
            value={formData.inverterType}
            onChange={(val) => onChange("inverterType", String(val))}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ACInputs;

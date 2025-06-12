// LaptopInputs.tsx
import React from "react";
import { Box, Checkbox, FormControlLabel, Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface LaptopInputsProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  startIndex?: number;
}

const LaptopInputs: React.FC<LaptopInputsProps> = ({ formData, onChange }) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);
  return (
    <>
      {/* <Box sx={{ maxHeight: "80vh", overflowY: "auto" }}> */}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Device Name"
              type="text"
              placeholder={transasset("devicename")}
              value={formData.deviceName}
              onChange={(val) => onChange("deviceName", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Serial Number"
              type="text"
              placeholder={transasset("serialnumber")}
              value={formData.serialNumber}
              onChange={(val) => onChange("serialNumber", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Model Name"
              type="text"
              placeholder={transasset("modelname")}
              value={formData.modelName}
              onChange={(val) => onChange("modelName", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="OS"
              type="text"
              placeholder={transasset("os")}
              value={formData.os}
              onChange={(val) => onChange("os", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="RAM"
              type="text"
              placeholder={transasset("ram")}
              value={formData.ram}
              onChange={(val) => onChange("ram", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Storage"
              type="text"
              placeholder={transasset("storage")}
              value={formData.storage}
              onChange={(val) => onChange("storage", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Processor"
              type="text"
              placeholder={transasset("processor")}
              value={formData.processor}
              onChange={(val) => onChange("processor", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Seller"
              type="text"
              placeholder={transasset("seller")}
              value={formData.seller}
              onChange={(val) => onChange("seller", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Date of Purchase"
              type="date"
              placeholder={transasset("dateOfPurchase")}
              value={formData.dateOfPurchase}
              onChange={(val) => onChange("dateOfPurchase", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Warranty Period"
              type="text"
              placeholder={transasset("warrantyPeriod")}
              value={formData.warrantyPeriod}
              onChange={(val) => onChange("warrantyPeriod", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Warranty Date"
              type="date"
              placeholder={transasset("warrantyDate")}
              value={formData.warrantyDate}
              onChange={(val) => onChange("warrantyDate", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Antivirus"
              type="text"
              placeholder={transasset("antivirus")}
              value={formData.antivirus}
              onChange={(val) => onChange("antivirus", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Recovery Key"
              type="text"
              placeholder={transasset("recoveryKey")}
              value={formData.recoveryKey}
              onChange={(val) => onChange("recoveryKey", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Last Serviced Date"
              type="date"
              placeholder={transasset("lastServicedDate")}
              value={formData.lastServicedDate}
              onChange={(val) => onChange("lastServicedDate", val)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormField
              label="Comment Service"
              type="text"
              placeholder={transasset("commentService")}
              value={formData.commentService}
              onChange={(val) => onChange("commentService", val)}
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
              label="Is Encrypted"
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LaptopInputs;

import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { IAssetAttributes, IAssetType } from "../interface/asset";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface AccessInputsProps {
  formData: IAssetAttributes;
  onChange: <K extends keyof IAssetAttributes>(field: K, value: IAssetAttributes[K]) => void;
  errors?: { [key: string]: string };
  selectedAssetType?: IAssetType;
}

const AccessInputs: React.FC<AccessInputsProps> = ({ formData, onChange, errors }) => {
  const transasset = useTranslations(LOCALIZATION.TRANSITION.ASSETS);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <FormField
          label={`${transasset("accesscardno")} ${transasset("required")}`}
          type="text"
          placeholder={transasset("accesscardno")}
          value={formData.accessCardNo || ""}
          error={errors?.accessCardNo}
          required
          onChange={(val) => onChange("accessCardNo", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={`${transasset("accesscardno2")} ${transasset("required")}`}
          type="text"
          placeholder={transasset("accesscardno2")}
          value={formData.accessCardNo2 || ""}
          error={errors?.accessCardNo2}
          required
          onChange={(val) => onChange("accessCardNo2", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={`${transasset("personalid")} ${transasset("required")}`}
          type="text"
          placeholder={transasset("personalid")}
          value={formData.personalId || ""}
          error={errors?.personalId}
          required
          onChange={(val) => onChange("personalId", String(val))}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={`${transasset("issuedon")} ${transasset("required")}`}
          type="date"
          placeholder={transasset("issuedon")}
          value={formData.issuedOn}
          error={errors?.issuedOn}
          onChange={(val) =>
            onChange(
              "issuedOn",
              val instanceof Date ? val.toISOString().split("T")[0] : String(val)
            )
          }
        />
      </Grid>
    </Grid>
  );
};

export default AccessInputs;

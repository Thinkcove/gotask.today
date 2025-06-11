"use client";
import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { IOrganizationField } from "../interfaces/organizatioinInterface";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";

interface IOrganizationInputProps {
  formData: IOrganizationField;
  errors?: { [key: string]: string };
  readOnlyFields?: string[];
  handleChange: (field: keyof IOrganizationField, value: string) => void;
}

const OrganizationInput = ({
  formData,
  errors,
  readOnlyFields = [],
  handleChange
}: IOrganizationInputProps) => {
  const transorganization = useTranslations(LOCALIZATION.TRANSITION.ORGANIZATION);
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormField
          label={transorganization("labelname")}
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", String(value))}
          required
          error={errors?.name}
          disabled={isReadOnly("name")}
          placeholder={transorganization("placeholdername")}
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transorganization("labeladdress")}
          type="text"
          value={formData.address}
          onChange={(value) => handleChange("address", String(value))}
          required
          error={errors?.address}
          disabled={isReadOnly("address")}
          placeholder={transorganization("placeholderaddress")}
          multiline
          height={80}
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transorganization("labelemail")}
          type="text"
          value={formData.mail_id}
          onChange={(value) => handleChange("mail_id", String(value))}
          required
          error={errors?.mail_id}
          disabled={isReadOnly("mail_id")}
          placeholder={transorganization("placeholderemail")}
        />
      </Grid>
      
      <Grid item xs={12}>
        <FormField
          label={transorganization("labelphone")}
          type="text"
          value={formData.mobile_no}
          onChange={(value) => handleChange("mobile_no", String(value))}
          required
          error={errors?.mobile_no}
          disabled={isReadOnly("mobile_no")}
          placeholder={transorganization("placeholderphone")}
          inputType="tel"
        />
      </Grid>
    </Grid>
  );
};

export default OrganizationInput;

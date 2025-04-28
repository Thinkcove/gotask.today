"use client";
import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/formField";
import { IOrganizationField } from "../interfaces/organizatioinInterface";

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
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormField
          label="Organization Name"
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", String(value))}
          required
          error={errors?.name}
          disabled={isReadOnly("name")}
          placeholder="Enter organization name"
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label="Address"
          type="text"
          value={formData.address}
          onChange={(value) => handleChange("address", String(value))}
          required
          error={errors?.address}
          disabled={isReadOnly("address")}
          placeholder="Enter organization address"
          multiline
          height={80}
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label="Email ID"
          type="text"
          value={formData.mail_id}
          onChange={(value) => handleChange("mail_id", String(value))}
          required
          error={errors?.mail_id}
          disabled={isReadOnly("mail_id")}
          placeholder="Enter organization mail_id"
        />
      </Grid>
    </Grid>
  );
};

export default OrganizationInput;

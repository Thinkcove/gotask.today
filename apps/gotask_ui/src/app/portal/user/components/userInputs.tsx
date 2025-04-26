"use client";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/formField";
import { IUserField } from "../interfaces/userInterface";
import { fetchAllOrganizations } from "../../organization/services/organizationAction";
import { fetchAllRoles } from "../../role/services/roleAction";

interface IUserInputProps {
  formData: IUserField;
  handleChange: (field: keyof IUserField, value: string) => void;
  errors: { [key: string]: string };
  readOnlyFields?: string[];
}

const UserInput = ({ formData, handleChange, errors, readOnlyFields = [] }: IUserInputProps) => {
  const { getOrganizations } = fetchAllOrganizations();
  const { getRoles } = fetchAllRoles();
  const isReadOnly = (field: string) => readOnlyFields.includes(field);
  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState<string[]>([]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormField
          label="User Name"
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", String(value))}
          required
          error={errors.name}
          disabled={isReadOnly("name")}
          placeholder="Enter user name"
        />
      </Grid>

      <Grid item xs={12}>
        <FormField
          label="Email"
          type="text"
          inputType="email"
          placeholder="Enter your email"
          required
          value={formData.user_id}
          onChange={(value) => handleChange("user_id", String(value))}
          error={errors?.user_id}
          disabled={isReadOnly("user_id")}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormField
          label="Role"
          type="select"
          placeholder="Select Role"
          options={getRoles}
          error={errors?.roleId}
          value={formData.roleId || ""}
          onChange={(value) => handleChange("roleId", String(value))}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormField
          label="Organization"
          type="multiselect"
          placeholder="Select Organization"
          options={getOrganizations}
          value={selectedOrganizationIds}
          onChange={(ids) => {
            const selectedIds = ids as string[];
            setSelectedOrganizationIds(selectedIds);

            // set formData.organization to the first selected id or empty string
            handleChange("organization", selectedIds.length > 0 ? selectedIds[0] : "");
          }}
          disabled={isReadOnly("organization")}
        />
      </Grid>

      <Grid item xs={12}>
        <FormField
          label="Password"
          type="text"
          inputType="password"
          placeholder="Enter password"
          required
          value={formData.password || ""}
          onChange={(value) => handleChange("password", String(value))}
        />
      </Grid>
    </Grid>
  );
};

export default UserInput;

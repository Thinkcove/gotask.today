"use client";
import React, { useState } from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/formField";
import { IRole } from "../interfaces/roleInterface";
import { fetchAllAccess } from "../services/roleAction";

interface IRoleInputProps {
  formData: IRole;
  errors?: Partial<Record<keyof IRole, string>>;
  readOnlyFields?: string[];
  handleChange: (field: keyof IRole, value: string | string[]) => void;
}

const RoleInput = ({ formData, errors, readOnlyFields = [], handleChange }: IRoleInputProps) => {
  const { getAllAccess } = fetchAllAccess();

  const isReadOnly = (field: string) => readOnlyFields.includes(field);
  const [selectedAccessIds, setSelectedAccessIds] = useState<string[]>(formData.accessIds || []);
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormField
          label="Role Name"
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", String(value))}
          required
          error={errors?.name}
          disabled={isReadOnly("name")}
          placeholder="Enter Role name"
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label="Access"
          type="multiselect"
          placeholder="Select Access"
          options={getAllAccess}
          value={selectedAccessIds}
          onChange={(ids) => {
            const selectedIds = ids as string[];
            setSelectedAccessIds(selectedIds);
            handleChange("accessIds", selectedIds);
          }}
          error={errors?.accessIds}
          disabled={isReadOnly("accessIds")}
        />
      </Grid>
    </Grid>
  );
};

export default RoleInput;

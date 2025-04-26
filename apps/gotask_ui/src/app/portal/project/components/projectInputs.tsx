"use client";
import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/formField";
import { IProjectField, PROJECT_WORKFLOW } from "../interfaces/projectInterface";
import { fetchAllOrganizations } from "../../organization/services/organizationAction";

interface IProjectInputProps {
  formData: IProjectField;
  errors?: { [key: string]: string };
  readOnlyFields?: string[];
  handleChange: (field: keyof IProjectField, value: string) => void;
}

const ProjectInput = ({
  formData,
  errors,
  readOnlyFields = [],
  handleChange
}: IProjectInputProps) => {
  const currentStatus = formData.status;
  const allowedStatuses = PROJECT_WORKFLOW[currentStatus] || [];
  const uniqueStatuses = Array.from(new Set([currentStatus, ...allowedStatuses]));
  const { getOrganizations } = fetchAllOrganizations();
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormField
          label="Project Name"
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", String(value))}
          required
          error={errors?.name}
          disabled={isReadOnly("name")}
          placeholder="Enter project name"
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label="Description"
          type="text"
          value={formData.description}
          onChange={(value) => handleChange("description", String(value))}
          required
          error={errors?.description}
          disabled={isReadOnly("description")}
          placeholder="Enter project description"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label="Status"
          type="select"
          options={uniqueStatuses.map((s) => s.toUpperCase())}
          required
          error={errors?.status}
          placeholder="Select project status"
          value={currentStatus.toUpperCase()}
          disabled={isReadOnly("status")}
          onChange={(value) => handleChange("status", String(value).toLowerCase())}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label="Organization"
          type="select"
          value={formData.organization_id}
          onChange={(value) => handleChange("organization_id", String(value))}
          options={getOrganizations}
          required
          disabled={isReadOnly("organization_id")}
          placeholder="Select organization"
        />
      </Grid>
    </Grid>
  );
};

export default ProjectInput;

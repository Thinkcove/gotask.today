"use client";
import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/formField";
import { IProjectField, PROJECT_WORKFLOW } from "../interfaces/projectInterface";

interface IProjectInputProps {
  formData: IProjectField;
  handleChange: (field: keyof IProjectField, value: String) => void;
}

const organizationOptions = [{ id: "1", name: "Thinkcove" }];

const ProjectInput = ({ formData, handleChange }: IProjectInputProps) => {
  const currentStatus = formData.status;
  const allowedStatuses = PROJECT_WORKFLOW[currentStatus] || [];
  const uniqueStatuses = Array.from(new Set([currentStatus, ...allowedStatuses]));

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormField
          label="Project Name"
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", String(value))}
          required
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
          placeholder="Enter project description"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label="Status"
          type="select"
          options={uniqueStatuses.map((s) => s.toUpperCase())}
          required
          placeholder="Select project status"
          value={currentStatus.toUpperCase()}
          onChange={(value) => handleChange("status", String(value).toLowerCase())}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label="Organization"
          type="select"
          value={formData.organization_id}
          onChange={(value) => handleChange("organization_id", String(value))}
          options={organizationOptions}
          required
          placeholder="Select organization"
        />
      </Grid>
    </Grid>
  );
};

export default ProjectInput;

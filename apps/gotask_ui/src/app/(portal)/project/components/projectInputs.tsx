"use client";
import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/formField";
import { IProjectField, PROJECT_WORKFLOW } from "../interfaces/projectInterface";
import { useAllOrganizations } from "../../organization/services/organizationAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

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
  const transproject = useTranslations(LOCALIZATION.TRANSITION.PROJECTS);
  const currentStatus = formData.status;
  const allowedStatuses = PROJECT_WORKFLOW[currentStatus] || [];
  const uniqueStatuses = Array.from(new Set([currentStatus, ...allowedStatuses]));
  const { getOrganizations } = useAllOrganizations();
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormField
          label={transproject("labelname")}
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", String(value))}
          required
          error={errors?.name}
          disabled={isReadOnly("name")}
          placeholder={transproject("placeholdername")}
        />
      </Grid>
      <Grid item xs={12}  >
        <FormField
          label={transproject("labeldescription")}
          type="text"
          value={formData.description}
          onChange={(value) => handleChange("description", String(value))}
          required
          multiline
          height={120}
          error={errors?.description}
          disabled={isReadOnly("description")}
          placeholder={transproject("placeholderdescription")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={transproject("labelstatus")}
          type="select"
          options={uniqueStatuses.map((s) => s.toUpperCase())}
          required
          error={errors?.status}
          placeholder={transproject("placeholderstatus")}
          value={currentStatus.toUpperCase()}
          disabled={isReadOnly("status")}
          onChange={(value) => handleChange("status", String(value).toLowerCase())}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={transproject("labelorganization")}
          type="select"
          value={formData.organization_id}
          onChange={(value) => handleChange("organization_id", String(value))}
          options={getOrganizations}
          required
          disabled={isReadOnly("organization_id")}
          placeholder={transproject("placeholderorganization")}
        />
      </Grid>
    </Grid>
  );
};

export default ProjectInput;

"use client";
import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { IRole } from "../interfaces/roleInterface";
import { useAllAccess } from "../services/roleAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";

interface IRoleInputProps {
  formData: IRole;
  errors?: Partial<Record<keyof IRole, string>>;
  readOnlyFields?: string[];
  handleChange: (field: keyof IRole, value: string | string[]) => void;
}

const RoleInput = ({ formData, errors, readOnlyFields = [], handleChange }: IRoleInputProps) => {
  const transrole = useTranslations(LOCALIZATION.TRANSITION.ROLE);
  const { getAllAccess } = useAllAccess();

  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormField
          label={transrole("labelname")}
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", String(value))}
          required
          error={errors?.name}
          disabled={isReadOnly("name")}
          placeholder={transrole("placeholdername")}
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transrole("labelaccess")}
          type="multiselect"
          placeholder={transrole("placeholderaccess")}
          options={getAllAccess}
          value={formData.accessIds}
          onChange={(ids) => handleChange("accessIds", ids as string[])}
          error={errors?.accessIds}
          disabled={isReadOnly("accessIds")}
        />
      </Grid>
    </Grid>
  );
};

export default RoleInput;

import React, { useState } from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { IUserField } from "../interfaces/userInterface";
import { useAllOrganizations } from "../../organization/services/organizationAction";
import { useAllRoles } from "../../role/services/roleAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { statusOptions } from "@/app/common/constants/user";
import { ONLY_ALPHANUMERIC_REGEX } from "@/app/common/constants/regex";
import { DIGIT_ONLY_REGEX } from "@/app/common/constants/regex";

interface IUserInputProps {
  formData: IUserField;
  handleChange: (field: keyof IUserField, value: string | string[] | boolean) => void;
  errors: { [key: string]: string };
  readOnlyFields?: string[];
}

const UserInput = ({ formData, handleChange, errors, readOnlyFields = [] }: IUserInputProps) => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const { getOrganizations } = useAllOrganizations();
  const { getRoles } = useAllRoles();
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState<string[]>(
    formData.organization || []
  );

  return (
    <Grid container spacing={1} sx={{ mt: 0, mb: 0 }}>
      <Grid item xs={12} md={4}>
        <FormField
          label={transuser("labelfirst_name")}
          type="text"
          value={formData.first_name}
          onChange={(v) => handleChange("first_name", String(v))}
          required
          error={errors.first_name}
          disabled={isReadOnly("first_name")}
          placeholder={transuser("placeholderfirst_name")}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormField
          label={transuser("labellast_name")}
          type="text"
          value={formData.last_name}
          onChange={(v) => handleChange("last_name", String(v))}
          required
          error={errors.last_name}
          disabled={isReadOnly("last_name")}
          placeholder={transuser("placeholderlast_name")}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormField
          label={transuser("labeluser")}
          type="text"
          value={formData.name}
          onChange={(v) => handleChange("name", String(v))}
          required
          error={errors.name}
          disabled={isReadOnly("name")}
          placeholder={transuser("placeholderuser")}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <FormField
          label={transuser("labelemp_id")}
          type="text"
          value={formData.emp_id}
          onChange={(v) => handleChange("emp_id", String(v).replace(ONLY_ALPHANUMERIC_REGEX, ""))}
          error={errors.emp_id}
          disabled={isReadOnly("emp_id")}
          placeholder={transuser("placeholderemp_id")}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormField
          label={transuser("labelemail")}
          type="text"
          inputType="email"
          placeholder={transuser("placeholderemail")}
          required
          value={formData.user_id}
          onChange={(v) => handleChange("user_id", String(v))}
          error={errors?.user_id}
          disabled={isReadOnly("user_id")}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormField
          label={transuser("labelmobile_no")}
          type="text"
          inputType="tel"
          placeholder={transuser("placeholdermobile_no")}
          required
          value={formData.mobile_no}
          onChange={(v) => {
            const sanitized = String(v).replace(DIGIT_ONLY_REGEX, "");
            if (sanitized.length <= 10) handleChange("mobile_no", sanitized);
          }}
          error={errors?.mobile_no}
          disabled={isReadOnly("mobile_no")}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <FormField
          label={transuser("labeljoined_date")}
          type="date"
          inputType="date"
          value={formData.joined_date}
          onChange={(v) => {
            if (v && (typeof v === "string" || v instanceof Date)) {
              const d = new Date(v);
              if (!isNaN(d.getTime())) handleChange("joined_date", d.toISOString());
            }
          }}
          required
          error={errors?.joined_date} 
          disabled={isReadOnly("joined_date")}
          placeholder={transuser("placeholderjoined_date")}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormField
          label={transuser("labelrole")}
          type="select"
          placeholder={transuser("placeholderrole")}
          options={getRoles}
          error={errors?.roleId}
          value={formData.roleId || ""}
          onChange={(v) => handleChange("roleId", String(v))}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <FormField
          label={transuser("labelstate")}
          type="select"
          placeholder={transuser("placeholderstatus")}
          options={statusOptions}
          error={errors?.status}
          value={formData.status.toString()}
          onChange={(v) => handleChange("status", v === "true")}
          disabled={isReadOnly("status")}
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transuser("labelorganization")}
          type="multiselect"
          placeholder={transuser("placeholderorganization")}
          options={getOrganizations}
          value={selectedOrganizationIds}
          onChange={(ids) => {
            const selectedIds = ids as string[];
            setSelectedOrganizationIds(selectedIds);
            handleChange("organization", selectedIds);
          }}
          disabled={isReadOnly("organization")}
        />
      </Grid>
    </Grid>
  );
};

export default UserInput;

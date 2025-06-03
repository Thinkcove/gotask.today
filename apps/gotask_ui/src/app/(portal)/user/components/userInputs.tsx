import React, { useState } from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { IUserField } from "../interfaces/userInterface";
import { useAllOrganizations } from "../../organization/services/organizationAction";
import { useAllRoles } from "../../role/services/roleAction";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { statusOptions } from "@/app/common/constants/user";

interface IUserInputProps {
  formData: IUserField;
  handleChange: (field: keyof IUserField, value: string | string[] | boolean) => void;
  errors: { [key: string]: string };
  readOnlyFields?: string[];
  isEdit?: boolean;
}

const UserInput = ({
  formData,
  handleChange,
  errors,
  readOnlyFields = [],
  isEdit = false
}: IUserInputProps) => {
  const transuser = useTranslations(LOCALIZATION.TRANSITION.USER);
  const { getOrganizations } = useAllOrganizations();
  const { getRoles } = useAllRoles();
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  // Initialize selectedOrganizationIds directly from formData.organization
  const [selectedOrganizationIds, setSelectedOrganizationIds] = useState<string[]>(
    formData.organization || [] // Initialize with the formData.organization value
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <FormField
          label={transuser("labeluser")}
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", String(value))}
          required
          error={errors.name}
          disabled={isReadOnly("name")}
          placeholder={transuser("placeholderuser")}
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transuser("labelemail")}
          type="text"
          inputType="email"
          placeholder={transuser("placeholderemail")}
          required
          value={formData.user_id}
          onChange={(value) => handleChange("user_id", String(value))}
          error={errors?.user_id}
          disabled={isReadOnly("user_id")}
        />
      </Grid>


<Grid item xs={12}>
  <FormField
    label={transuser("labelphone")}
    type="text"
    inputType="tel"
    placeholder={transuser("placeholderphone")}
    required
    value={formData.phone}
    onChange={(value) => handleChange("phone", String(value))}
    error={errors?.phone}
    disabled={isReadOnly("phone")}
  />
</Grid>

<Grid item xs={12}>
  <FormField
    label={transuser("labeljoinDate")}
    type="date"
    inputType="date"
    value={formData.joinDate}
    // onChange={(value) => handleChange("joinDate", new Date(value).toLocaleDateString())}
   //   onChange={(value) =>
  // handleChange("joinDate", new Date(value as string).toISOString())
onChange={(value) => {
  if (value !== undefined && (typeof value === "string" || value instanceof Date)) {
    const date = new Date(value); // ✅ only called if value is defined and valid
    if (!isNaN(date.getTime())) {
      handleChange("joinDate", date.toISOString());
    }
  }
}}




    required
    error={errors?.joinDate}
    disabled={isReadOnly("joinDate")}
    placeholder={transuser("placeholderjoinDate")}
  />
</Grid>
 

      <Grid item xs={12} sm={6}>
        <FormField
          label={transuser("labelrole")}
          type="select"
          placeholder={transuser("placeholderrole")}
          options={getRoles}
          error={errors?.roleId}
          value={formData.roleId || ""}
          onChange={(value) => handleChange("roleId", String(value))}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={transuser("labelstate")}
          type="select"
          placeholder={transuser("placeholderstatus")}
          options={statusOptions}
          error={errors?.status}
          value={formData.status.toString()}
          onChange={(value) => handleChange("status", value === "true")}
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
            const selectedIds = ids as string[]; // Ensure selectedIds is an array of strings
            setSelectedOrganizationIds(selectedIds);

            // Set formData.organization to the selected array
            handleChange("organization", selectedIds);
          }}
          disabled={isReadOnly("organization")}
        />
      </Grid>
      {isEdit && (
        <Grid item xs={12}>
          <FormField
            label={transuser("labelpassword")}
            type="text"
            inputType="password"
            placeholder={transuser("placeholderpassword")}
            required
            error={errors?.password}
            value={formData.password || ""}
            onChange={(value) => handleChange("password", String(value))}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default UserInput;

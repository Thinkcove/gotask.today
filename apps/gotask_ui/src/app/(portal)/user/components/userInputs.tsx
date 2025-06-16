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
import { Country, State } from "country-state-city";
import { SelectOption } from "../../../component/input/formField";

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
        <div
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginBottom: "10px",
            marginTop: "20px"
          }}
        >
          {transuser("generalinfo")}
        </div>
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transuser("labelemp_id")}
          type="text"
          value={formData.emp_id}
          onChange={(value) => {
            const alphanumeric = String(value).replace(ONLY_ALPHANUMERIC_REGEX, "");
            handleChange("emp_id", alphanumeric);
          }}
          required={false}
          error={errors.emp_id}
          disabled={isReadOnly("emp_id")}
          placeholder={transuser("placeholderemp_id")}
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transuser("labelfirst_name")}
          type="text"
          value={formData.first_name}
          onChange={(value) => handleChange("first_name", String(value))}
          required={true}
          error={errors.first_name}
          disabled={isReadOnly("first_name")}
          placeholder={transuser("placeholderfirst_name")}
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transuser("labellast_name")}
          type="text"
          value={formData.last_name}
          onChange={(value) => handleChange("last_name", String(value))}
          required={true}
          error={errors.last_name}
          disabled={isReadOnly("last_name")}
          placeholder={transuser("placeholderlast_name")}
        />
      </Grid>
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
        <div
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginBottom: "10px",
            marginTop: "20px"
          }}
        >
          {transuser("contactinfo")}
        </div>
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
          label={transuser("labelmobile_no")}
          type="text"
          inputType="tel"
          placeholder={transuser("placeholdermobile_no")}
          required
          value={formData.mobile_no}
          onChange={(value) => {
            const sanitized = String(value).replace(DIGIT_ONLY_REGEX, ""); // Remove non-digits
            if (sanitized.length <= 10) {
              handleChange("mobile_no", sanitized);
            }
          }}
          error={errors?.mobile_no}
          disabled={isReadOnly("mobile_no")}
        />
      </Grid>
      {/* new fields */}
      <Grid item xs={12}>
        <FormField
          label={transuser("labelalternate_no")}
          type="text"
          inputType="tel"
          value={formData.alternate_no}
          onChange={(value) => {
            const sanitized = String(value).replace(DIGIT_ONLY_REGEX, "");
            if (sanitized.length <= 10) {
              handleChange("alternate_no", sanitized);
            }
          }}
          required={false}
          error={errors?.alternate_no}
          disabled={isReadOnly("alternate_no")}
          placeholder={transuser("placeholderalternate_no")}
        />
      </Grid>
      <Grid item xs={12}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginBottom: "10px",
            marginTop: "20px"
          }}
        >
          {transuser("empinfo")}
        </div>
      </Grid>
      <Grid item xs={12}>
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
      <Grid item xs={12}>
        <FormField
          label={transuser("labeljoined_date")}
          type="date"
          inputType="date"
          value={formData.joined_date}
          onChange={(value) => {
            if (value !== undefined && (typeof value === "string" || value instanceof Date)) {
              const date = new Date(value); // only called if value is defined and valid
              if (!isNaN(date.getTime())) {
                handleChange("joined_date", date.toISOString());
              }
            }
          }}
          required={true}
          error={errors?.joinDate}
          disabled={isReadOnly("joined_date")}
          placeholder={transuser("placeholderjoined_date")}
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
      <Grid item xs={12}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginBottom: "10px",
            marginTop: "20px"
          }}
        >
          {transuser("addressinfo")}
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={transuser("labelcountry")}
          type="select"
          value={formData.country as string}
          onChange={(value) => {
            handleChange("country", value as string);
            handleChange("state", ""); // Reset state when country changes
          }}
          options={
            Country.getAllCountries().map((c) => ({
              label: c.name,
              value: c.isoCode,
              name: c.name,
              id: c.isoCode
            })) as SelectOption[]
          }
          required={false}
          error={errors.country}
          disabled={isReadOnly("country")}
          placeholder={transuser("placeholdercountry")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormField
          label={transuser("labelState")}
          type="select"
          value={formData.state}
          onChange={(value) => handleChange("state", value as string)}
          options={
            formData.country
              ? (State.getStatesOfCountry(formData.country).map((s) => ({
                  label: s.name,
                  value: s.isoCode,
                  name: s.name,
                  id: s.isoCode
                })) as SelectOption[])
              : []
          }
          required={false}
          error={errors.state}
          disabled={!formData.country || isReadOnly("state")}
          placeholder={transuser("placeholderstate")}
        />
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transuser("labeladdress")}
          type="text"
          value={formData.address}
          onChange={(value) => handleChange("address", String(value))}
          required
          error={errors.address}
          disabled={isReadOnly("address")}
          placeholder={transuser("placeholderaddress")}
        />
      </Grid>
      <Grid item xs={12}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "16px",
            marginBottom: "10px",
            marginTop: "20px"
          }}
        >
          {transuser("sectionSkillsCertifications")}
        </div>
      </Grid>
      <Grid item xs={12}>
        <FormField
          label={transuser("labelSkills")}
          type="text"
          value={formData.skills}
          onChange={(value) => handleChange("skills", String(value))}
          required
          error={errors.skills}
          disabled={isReadOnly("skills")}
          placeholder={transuser("placeholderSkills")}
        />
      </Grid>

      <Grid item xs={12}>
        <FormField
          label={transuser("labelCertifications")}
          type="text"
          value={formData.certifications}
          onChange={(value) => handleChange("certifications", String(value))}
          required
          error={errors.certifications}
          disabled={isReadOnly("certifications")}
          placeholder={transuser("placeholderCertifications")}
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

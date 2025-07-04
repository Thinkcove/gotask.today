"use client";

import React from "react";
import { Grid } from "@mui/material";
import FormField from "@/app/component/input/formField";
import {
  KPI_FREQUENCY,
  MEASUREMENT_CRITERIA_OPTIONS,
  STATUS_OPTIONS
} from "@/app/common/constants/kpi";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { Template } from "../../service/templateInterface";

interface TemplateInputProps {
  formData: Partial<Template>;
  handleChange: <K extends keyof Partial<Template>>(field: K, value: Partial<Template>[K]) => void;
  errors: { [key: string]: string };
  handleInputChange?: (name: string, value: string) => void;
  readOnlyFields?: string[];
}

const TemplateInput: React.FC<TemplateInputProps> = ({
  formData,
  handleChange,
  errors,
  readOnlyFields = []
}) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <FormField
            label={`${transkpi("title")} ${transkpi("required")}`}
            type="text"
            required
            placeholder={transkpi("entername")}
            value={formData.title}
            onChange={(val) => handleChange("title", String(val))}
            error={errors.title}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("frequency")} ${transkpi("required")}`}
            placeholder={transkpi("enterfrequency")}
            type="select"
            options={Object.values(KPI_FREQUENCY)}
            value={formData.frequency}
            onChange={(val) => handleChange("frequency", String(val))}
            error={errors.frequency}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={`${transkpi("weightage")} ${transkpi("required")}`}
            type="select"
            placeholder={transkpi("enterweightage")}
            options={MEASUREMENT_CRITERIA_OPTIONS.map((opt) => ({
              id: String(opt.value),
              name: opt.label
            }))}
            required
            value={String(formData.measurement_criteria)}
            onChange={(val) => handleChange("measurement_criteria", Number(val))}
            error={errors.measurement_criteria}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <FormField
            label={transkpi("status")}
            placeholder={transkpi("enterstatus")}
            type="select"
            options={Object.values(STATUS_OPTIONS)}
            value={formData.status}
            onChange={(val) => handleChange("status", String(val))}
            error={errors.status}
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            label={`${transkpi("labeldescription")} ${transkpi("required")}`}
            type="text"
            placeholder={transkpi("placeholderdescription")}
            value={formData.description}
            onChange={(val) => handleChange("description", String(val))}
            error={errors.description}
            disabled={isReadOnly("description")}
            multiline
          />
        </Grid>
      </Grid>
    </>
  );
};

export default TemplateInput;

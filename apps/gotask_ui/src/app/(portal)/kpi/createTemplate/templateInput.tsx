"use client";
import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from "@mui/material";
import FormField from "@/app/component/input/formField";
import {
  KPI_FREQUENCY,
  MEASUREMENT_CRITERIA_OPTIONS,
  STATUS_OPTIONS
} from "@/app/common/constants/kpi";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { useTranslations } from "next-intl";
import { Template } from "../service/templateInterface";

interface TemplateInputProps {
  formData: Partial<Template>;
  handleChange: <K extends keyof Partial<Template>>(field: K, value: Partial<Template>[K]) => void;
  errors: { [key: string]: string };
}

const TemplateInput: React.FC<TemplateInputProps> = ({ formData, handleChange, errors }) => {
  const transkpi = useTranslations(LOCALIZATION.TRANSITION.KPI);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
          mb: 2
        }}
      >
        <FormField
          label={`${transkpi("name")} ${transkpi("required")}`}
          type="text"
          required
          placeholder={transkpi("entername")}
          value={formData.title}
          onChange={(val) => handleChange("title", String(val))}
          error={errors.name}
        />
        <FormField
          label={`${transkpi("frequency")} ${transkpi("required")}`}
          type="select"
          options={Object.values(KPI_FREQUENCY)}
          value={formData.frequency}
          onChange={(val) => handleChange("frequency", String(val))}
          error={errors.frequency}
        />
        <FormField
          label={transkpi("status")}
          type="select"
          options={STATUS_OPTIONS}
          value={formData.status}
          onChange={(val) => handleChange("status", String(val))}
          error={errors.status}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <FormField
          label={transkpi("description")}
          type="text"
          placeholder={transkpi("enterdescription")}
          multiline
          value={formData.description}
          sx={{ width: "100%" }}
          onChange={(val) => handleChange("description", String(val))}
        />
      </Box>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend">{`${transkpi("weightage")} ${transkpi("required")}`}</FormLabel>
        <RadioGroup
          row
          value={formData.measurement_criteria}
          onChange={(e) => handleChange("measurement_criteria", e.target.value)}
          sx={{ flexWrap: "wrap", gap: 1 }}
        >
          {MEASUREMENT_CRITERIA_OPTIONS.map((value) => (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio />}
              label={value.toString()}
            />
          ))}
        </RadioGroup>
        {errors.weightage && (
          <Typography color="error.main" fontSize="0.875rem" sx={{ mt: 1 }}>
            {errors.weightage}
          </Typography>
        )}
      </FormControl>
    </>
  );
};

export default TemplateInput;

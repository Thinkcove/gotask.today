import React from "react";
import Grid from "@mui/material/Grid/Grid";
import { Box, Typography } from "@mui/material";
import FormField from "@/app/component/input/formField";

interface PremissionFormProps {
  formData: {
    startDate: string;
    startTime: string;
    endTime: string;
  };
  errors: {
    startDate?: string;
    startTime?: string;
    endTime?: string;
  };
  onFormDataChange: (field: string, value: string) => void;
  isSubmitting: boolean;
  user?: string;
}

function PremissionForm({
  formData,
  errors,
  onFormDataChange,
  isSubmitting,
  user
}: PremissionFormProps) {
  const handleDateChange = (
    field: "startDate" | "endDate",
    value: string | number | Date | string[]
  ): void => {
    if (typeof value !== "string") return;
    onFormDataChange(field, value);
  };

  const handleTimeChange = (
    field: "startTime" | "endTime",
    value: string | number | Date | string[]
  ): void => {
    if (typeof value !== "string") return;
    onFormDataChange(field, value);
  };

  return (
    <Box sx={{ pl: 2, pr: 2 }}>
      <Grid container spacing={3}>
        {user && (
          <Grid item xs={12} sm={6}>
            <FormField
              label="User Name"
              type="text"
              inputType="text"
              placeholder="User name"
              value={user}
              required
              disabled={true}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <FormField
            label="Start Date"
            type="date"
            inputType="date"
            placeholder="Select start date"
            value={formData.startDate}
            error={errors.startDate}
            onChange={(value: string | number | Date | string[]) =>
              handleDateChange("startDate", value)
            }
            required
            disabled={isSubmitting}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="Start Time"
            type="text"
            inputType="time"
            placeholder="Select start time"
            value={formData.startTime}
            error={errors.startTime}
            onChange={(value: string | number | Date | string[]) =>
              handleTimeChange("startTime", value)
            }
            required
            disabled={isSubmitting}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormField
            label="End Time"
            type="text"
            inputType="time"
            placeholder="Select end time"
            value={formData.endTime}
            error={errors.endTime}
            onChange={(value: string | number | Date | string[]) =>
              handleTimeChange("endTime", value)
            }
            required
            disabled={isSubmitting}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PremissionForm;

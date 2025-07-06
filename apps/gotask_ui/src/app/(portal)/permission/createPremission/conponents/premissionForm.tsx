import React from "react";
import Grid from "@mui/material/Grid/Grid";
import { Box } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { PremissionFormProps } from "../../interface/interface";

function PremissionForm({
  formData,
  errors,
  onFormDataChange,
  isSubmitting,
  user
}: PremissionFormProps) {
  const transpermishion = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

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
              label={transpermishion("username")}
              type="text"
              inputType="text"
              placeholder={transpermishion("username")}
              value={user}
              required
              disabled={true}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <FormField
            label={transpermishion("startdate")}
            type="date"
            inputType="date"
            placeholder={transpermishion("startdate")}
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
            label={transpermishion("starttime")}
            type="text"
            inputType="time"
            placeholder={transpermishion("starttime")}
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
            label={transpermishion("endtime")}
            type="text"
            inputType="time"
            placeholder={transpermishion("endtime")}
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

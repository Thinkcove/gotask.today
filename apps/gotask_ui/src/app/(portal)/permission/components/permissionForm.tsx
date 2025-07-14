import React from "react";
import Grid from "@mui/material/Grid/Grid";
import { Box } from "@mui/material";
import FormField from "@/app/component/input/formField";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { PermissionFormProps } from "../interface/interface";

function PermissionForm({
  formData,
  errors,
  onFormDataChange,
  isSubmitting,
  user
}: PermissionFormProps) {
  const transpermission = useTranslations(LOCALIZATION.TRANSITION.PERMISSION);

  const handleDateChange = (
    field: "startDate" | "endDate",
    value: string | number | Date | string[]
  ): void => {
    if (typeof value !== "string") return;
    onFormDataChange(field, value);
  };

  const handleTimeChange = (field: "comments", value: string | number | Date | string[]): void => {
    if (typeof value !== "string") return;
    onFormDataChange(field, value);
  };

  const handleTimePickerChange = (field: "startTime" | "endTime", value: string): void => {
    onFormDataChange(field, value);
  };

  return (
    <Box sx={{ pl: 2, pr: 2 }}>
      <Grid container spacing={3}>
        {user && (
          <Grid item xs={12} sm={6}>
            <FormField
              label={transpermission("username")}
              type="text"
              inputType="text"
              placeholder={transpermission("username")}
              value={user}
              required
              disabled={true}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <FormField
            label={transpermission("permissionon")}
            type="date"
            inputType="date"
            placeholder={transpermission("startdate")}
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
          <TimePickerField
            label={transpermission("starttime")}
            placeholder={transpermission("starttime")}
            value={formData.startTime}
            error={errors.startTime}
            onChange={(value: string) => handleTimePickerChange("startTime", value)}
            required
            disabled={isSubmitting}
            ampm={true}
            ampmInClock={true}
            minutesStep={1}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TimePickerField
            label={transpermission("endtime")}
            placeholder={transpermission("endtime")}
            value={formData.endTime}
            error={errors.endTime}
            onChange={(value: string) => handleTimePickerChange("endTime", value)}
            required
            disabled={isSubmitting}
            ampm={true}
            ampmInClock={true}
            minutesStep={1}
          />
        </Grid>

        <Grid item xs={12}>
          <FormField
            label={transpermission("labelreson")}
            type="text"
            placeholder={transpermission("comments")}
            value={formData.comments}
            onChange={(val) => handleTimeChange("comments", String(val))}
            required
            multiline
            disabled={isSubmitting}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default PermissionForm;

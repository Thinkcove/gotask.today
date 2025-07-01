import React, { useRef } from "react";
import FormField from "@/app/component/input/formField";
import Grid from "@mui/material/Grid/Grid";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { priorityOptions, statusOptions } from "@/app/common/constants/project";
import { ProjectGoalFormProps } from "../interface/projectGoal";
import ReusableEditor from "@/app/component/richText/textEditor";
import { Typography } from "@mui/material";

const ProjectGoalForm: React.FC<ProjectGoalFormProps> = ({
  goalData,
  errors,
  rteRef,
  setGoalData
}) => {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transGoal("goaltitle")}
            placeholder={transGoal("goaltitlePlaceholder")}
            type="text"
            value={goalData.goalTitle}
            error={errors.goalTitle}
            onChange={(val) => setGoalData({ ...goalData, goalTitle: val as string })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transGoal("startdate")}
            type="date"
            inputType="date"
            placeholder={transGoal("startdate")}
            value={goalData.weekStart}
            error={errors.weekStart}
            onChange={(value) => {
              if (value && (typeof value === "string" || value instanceof Date)) {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  setGoalData({ ...goalData, weekStart: date.toISOString().split("T")[0] });
                }
              }
            }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transGoal("enddate")}
            type="date"
            inputType="date"
            placeholder={transGoal("enddate")}
            value={goalData.weekEnd}
            error={errors.weekEnd}
            onChange={(value) => {
              if (value && (typeof value === "string" || value instanceof Date)) {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                  setGoalData({ ...goalData, weekEnd: date.toISOString().split("T")[0] });
                }
              }
            }}
            required
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormField
            label={transGoal("status")}
            type="select"
            placeholder={transGoal("statusPlaceholder")}
            options={statusOptions}
            value={goalData.status}
            error={errors.status}
            onChange={(val) => setGoalData({ ...goalData, status: val as string })}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormField
            label={transGoal("priority")}
            type="select"
            placeholder={transGoal("priorityPlaceholder")}
            options={priorityOptions}
            value={goalData.priority}
            error={errors.priority}
            onChange={(val) => setGoalData({ ...goalData, priority: val as string })}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={4} pt={2}>
        <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
          {transGoal("description")}
        </Typography>
        <ReusableEditor
          ref={rteRef}
          content={goalData.description}
          onSave={(val) => setGoalData({ ...goalData, description: val as string })}
          placeholder={transGoal("descriptionPlaceholder")}
          showSaveButton={false}
        />
      </Grid>
    </>
  );
};

export default ProjectGoalForm;

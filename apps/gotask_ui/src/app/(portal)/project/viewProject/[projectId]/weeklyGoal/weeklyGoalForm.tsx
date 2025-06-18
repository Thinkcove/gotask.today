// components/forms/WeeklyGoalForm.tsx

import React from "react";
import FormField from "@/app/component/input/formField";
import Grid from "@mui/material/Grid/Grid";

interface GoalData {
  goalTitle: string;
  description: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  priority: string;
  comments: string;
  userId?: string;
  projectId?: string;
}

interface WeeklyGoalFormProps {
  goalData: GoalData;
  setGoalData: (data: GoalData) => void;
}

const statusOptions = ["Not-started", "In-progress", "Completed", "Blocked"];
const priorityOptions = ["High", "Medium", "Low"];

const WeeklyGoalForm: React.FC<WeeklyGoalFormProps> = ({ goalData, setGoalData }) => {
  return (
    <Grid container spacing={3}>
      {/* Row 1: Goal Title, Start Week, End Week */}
      <Grid item xs={12} sm={4}>
        <FormField
          label="Goal Title"
          type="text"
          value={goalData.goalTitle}
          onChange={(val) => setGoalData({ ...goalData, goalTitle: val as string })}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label="Start Week"
          type="date"
          inputType="date"
          value={goalData.weekStart}
          onChange={(value) => {
            if (value && (typeof value === "string" || value instanceof Date)) {
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                setGoalData({ ...goalData, weekStart: date.toISOString() });
              }
            }
          }}
          required
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label="End Week"
          type="date"
          inputType="date"
          value={goalData.weekEnd}
          onChange={(value) => {
            if (value && (typeof value === "string" || value instanceof Date)) {
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                setGoalData({ ...goalData, weekEnd: date.toISOString() });
              }
            }
          }}
          required
        />
      </Grid>

      {/* Row 2: Status, Priority, Description */}
      <Grid item xs={12} sm={4}>
        <FormField
          label="Status"
          type="select"
          placeholder="Select status"
          options={statusOptions}
          value={goalData.status}
          onChange={(val) => setGoalData({ ...goalData, status: val as string })}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label="Priority"
          type="select"
          placeholder="Select priority"
          options={priorityOptions}
          value={goalData.priority}
          onChange={(val) => setGoalData({ ...goalData, priority: val as string })}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label="Description"
          type="text"
          multiline
          height={100}
          value={goalData.description}
          onChange={(val) => setGoalData({ ...goalData, description: val as string })}
        />
      </Grid>

      {/* Row 3: Comments */}
      <Grid item xs={12}>
        <FormField
          label="Comments (comma separated)"
          type="text"
          multiline
          value={goalData.comments}
          onChange={(val) => setGoalData({ ...goalData, comments: val as string })}
        />
      </Grid>
    </Grid>
  );
};

export default WeeklyGoalForm;

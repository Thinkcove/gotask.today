// ProjectGoalForm.tsx
import React from "react";
import FormField from "@/app/component/input/formField";
import Grid from "@mui/material/Grid/Grid";
import { Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { GoalData, ProjectGoalFormProps } from "../../interface/projectGoal";


const statusOptions = ["not-started", "in-progress", "completed", "blocked"];
const priorityOptions = ["high", "medium", "low"];

const ProjectGoalForm: React.FC<ProjectGoalFormProps> = ({
  goalData,
  newComment,
  setNewComment,
  setGoalData
}) => {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.WEEKLYGOAL);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transGoal("goaltitle")}
          placeholder={transGoal("goaltitlePlaceholder")}
          type="text"
          value={goalData.goalTitle}
          onChange={(val) => setGoalData({ ...goalData, goalTitle: val as string })}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transGoal("startweek")}
          type="date"
          inputType="date"
          placeholder={transGoal("startdate")}
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
          label={transGoal("endweek")}
          type="date"
          inputType="date"
          placeholder={transGoal("enddate")}
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

      <Grid item xs={12} sm={4}>
        <FormField
          label={transGoal("status")}
          type="select"
          placeholder={transGoal("statusPlaceholder")}
          options={statusOptions}
          value={goalData.status}
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
          onChange={(val) => setGoalData({ ...goalData, priority: val as string })}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormField
          label={transGoal("description")}
          type="text"
          placeholder={transGoal("descriptionPlaceholder")}
          multiline
          height={100}
          value={goalData.description}
          onChange={(val) => setGoalData({ ...goalData, description: val as string })}
        />
      </Grid>

      <Grid item xs={12}>
        <FormField
          label={transGoal("addcomment")}
          type="text"
          placeholder={transGoal("addcommentPlaceholder")}
          value={newComment}
          onChange={(val) => setNewComment(val as string)}
        />
        <Button
          variant="contained"
          sx={{ mt: 1, backgroundColor: "#741B92", textTransform: "none" }}
          onClick={() => {
            if (newComment.trim()) {
              setGoalData((prev: GoalData) => ({
                ...prev,
                comments: [...(prev.comments || []), newComment.trim()]
              }));
              setNewComment("");
            }
          }}
        >
          {transGoal("addcomment")}
        </Button>
      </Grid>

      {goalData?.comments?.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: "#741B92" }}>
            {transGoal("commentlist")}
          </Typography>
          <ul style={{ paddingLeft: 20 }}>
            {goalData.comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        </Grid>
      )}
    </Grid>
  );
};

export default ProjectGoalForm;

import React from "react";
import FormField from "@/app/component/input/formField";
import Grid from "@mui/material/Grid/Grid";
import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { LOCALIZATION } from "@/app/common/constants/localization";
import { GoalData, ProjectGoalFormProps, GoalDataPayload } from "../../interface/projectGoal";
import { Comment } from "@/app/(portal)/goals/projectid/[projectId]/interface/projectGoal";
import CommonCommentBox from "./commentBox";
import { priorityOptions, statusOptions } from "@/app/common/constants/project";

const ProjectGoalForm: React.FC<ProjectGoalFormProps> = ({ goalData, setGoalData, onSubmit }) => {
  const transGoal = useTranslations(LOCALIZATION.TRANSITION.PROJECTGOAL);

  const transformToPayload = (data: GoalData): GoalDataPayload => {
    return {
      ...data,
      comments: data.comments.map((comment) => comment.comment)
    };
  };

  const handleSubmit = () => {
    if (onSubmit) {
      const payload = transformToPayload(goalData);
      onSubmit(payload);
    }
  };

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
                setGoalData({ ...goalData, weekStart: date.toISOString().split("T")[0] });
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
        <CommonCommentBox
          comments={goalData.comments}
          currentUserId={"your-current-user-id"}
          onSave={(commentText) => {
            const newComment: Comment = {
              id: Date.now(),
              comment: commentText,
              user_name: "Current User",
              user_id: "your-current-user-id",
              updatedAt: new Date().toISOString()
            };

            setGoalData((prev) => ({
              ...prev,
              comments: [...prev.comments, newComment]
            }));
          }}
          onEdit={(id, updatedComment) => {
            setGoalData((prev) => ({
              ...prev,
              comments: prev.comments.map((c) =>
                c.id === id
                  ? { ...c, comment: updatedComment, updatedAt: new Date().toISOString() }
                  : c
              )
            }));
          }}
          onDelete={(id) => {
            setGoalData((prev) => ({
              ...prev,
              comments: prev.comments.filter((c) => c.id !== id)
            }));
          }}
        />
      </Grid>

      {/* Add submit button if onSubmit is provided */}
      {onSubmit && (
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#741B92",
                textTransform: "none",
                "&:hover": { backgroundColor: "#5a1472" }
              }}
            >
              {transGoal("submit", { default: "Submit" })}
            </Button>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default ProjectGoalForm;

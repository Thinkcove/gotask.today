// ProjectGoalForm.tsx
import React from "react";
import FormField from "@/app/component/input/formField";
import Grid from "@mui/material/Grid/Grid";
import { Button, Typography } from "@mui/material";

// Shared GoalData type
export interface GoalData {
  goalTitle: string;
  description: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  priority: string;
  projectId?: string;
  comments: string[];
  id?: string;
}

interface ProjectGoalFormProps {
  goalData: GoalData;
  setGoalData: React.Dispatch<React.SetStateAction<GoalData>>;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
}

const statusOptions = ["not-started", "in-progress", "completed", "blocked"];
const priorityOptions = ["high", "medium", "low"];

const ProjectGoalForm: React.FC<ProjectGoalFormProps> = ({
  goalData,
  newComment,
  setNewComment,
  setGoalData
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <FormField
          label="Goal Title"
          placeholder="Title"
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
          placeholder="Start Date"
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
          placeholder="End Date"
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
          placeholder="Description"
          multiline
          height={100}
          value={goalData.description}
          onChange={(val) => setGoalData({ ...goalData, description: val as string })}
        />
      </Grid>

      <Grid item xs={12}>
        <FormField
          label="Add Comment"
          type="text"
          placeholder="Enter a comment"
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
          Add Comment
        </Button>
      </Grid>

      {goalData?.comments?.length > 0 && (
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: "#741B92" }}>
            Comments:
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

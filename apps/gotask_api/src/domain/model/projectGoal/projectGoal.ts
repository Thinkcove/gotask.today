import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { TASK_SEVERITY } from "../../../constants/taskConstant";
import { PROJECT_SEVERITY, PROJECTGOAL_STATUS } from "../../../constants/projectGoalConstants";

export type ProjectGoalSeverity = (typeof PROJECT_SEVERITY)[keyof typeof PROJECT_SEVERITY];
export type ProjectGoalStatus = (typeof PROJECTGOAL_STATUS)[keyof typeof PROJECTGOAL_STATUS];

// Interface for TypeScript
export interface IProjectGoal extends Document {
  id: string;
  projectId: string;
  goalTitle: string;
  weekStart: Date;
  weekEnd: Date;
  comments: string[];
  priority: ProjectGoalSeverity;
  description?: string;
  status: ProjectGoalStatus;
}

// Schema definition
const ProjectGoalSchema = new Schema<IProjectGoal>(
  {
    id: { type: String, default: uuidv4, unique: true },
    projectId: { type: String, ref: "Project", required: true },
    goalTitle: { type: String, required: true },
    description: { type: String, default: "" },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    comments: { type: [String], default: [] },
    priority: {
      type: String,
      enum: Object.values(TASK_SEVERITY)
    },
    status: {
      type: String,
      enum: Object.values(PROJECTGOAL_STATUS)
    }
  },
  {
    timestamps: true
  }
);

// Export the model
export const ProjectGoal = model<IProjectGoal>("ProjectGoal", ProjectGoalSchema);

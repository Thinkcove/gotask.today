import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Interface for TypeScript
export interface IWeeklyGoal extends Document {
  id: string;
  projectId: string;
  goalTitle: string;
  weekStart: Date;
  weekEnd: Date;
  comments: string[];
  priority: "Low" | "Medium" | "High";
  description?: string;
  status: "Not-started" | "In-progress" | "Completed" | "Blocked"; // suggested enum for clarity
}

// Schema definition
const WeeklyGoalSchema = new Schema<IWeeklyGoal>(
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
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["Not-started", "In-progress", "Completed", "Blocked"], // You can adjust the allowed values as needed
      default: "Not-started"
    }
  },
  {
    timestamps: true
  }
);

// Export the model
export const WeeklyGoal = model<IWeeklyGoal>("WeeklyGoal", WeeklyGoalSchema);

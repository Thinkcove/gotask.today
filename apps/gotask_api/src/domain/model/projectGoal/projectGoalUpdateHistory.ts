// src/model/projectGoal/projectGoalUpdateHistory.ts

import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IProjectGoalUpdateHistory extends Document {
  id: string;
  goal_id: string;
  user_id: string;
  formatted_history: string;
}

// Update your schema to match new format
const ProjectGoalUpdateHistorySchema = new Schema<IProjectGoalUpdateHistory>(
  {
    id: { type: String, default: uuidv4 },
    goal_id: { type: String, required: true, ref: "ProjectGoal" },
    user_id: { type: String, required: true, ref: "User" },
    formatted_history: { type: String, required: true }, // ✅ Add this
  },
  { timestamps: true }
);


export const ProjectGoalUpdateHistory = model<IProjectGoalUpdateHistory>(
  "ProjectGoalUpdateHistory",
  ProjectGoalUpdateHistorySchema
);

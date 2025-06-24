// src/model/projectGoal/projectGoalUpdateHistory.ts

import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IProjectGoalUpdateHistory extends Document {
  id: string;
  goal_id: string;
  updated_by: string;
  update_data: Record<string, any>;
  timestamp: Date;
}

const ProjectGoalUpdateHistorySchema = new Schema<IProjectGoalUpdateHistory>({
  id: { type: String, default: uuidv4, unique: true },
  goal_id: { type: String, required: true, ref: "ProjectGoal" },
  updated_by: { type: String, required: true, ref: "User" }, // user_id
  update_data: { type: Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const ProjectGoalUpdateHistory = model<IProjectGoalUpdateHistory>(
  "ProjectGoalUpdateHistory",
  ProjectGoalUpdateHistorySchema
);

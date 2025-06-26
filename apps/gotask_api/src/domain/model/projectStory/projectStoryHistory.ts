import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IProjectStoryHistory extends Document {
  id: string;
  project_story_id: string;
  loginuser_id: string;
  loginuser_name: string;
  formatted_history: string;
  created_date: Date;
}

export const ProjectStoryHistorySchema = new Schema<IProjectStoryHistory>({
  id: { type: String, default: uuidv4 },
  project_story_id: { type: String, required: true },
  loginuser_id: { type: String, required: true },
  loginuser_name: { type: String },
  formatted_history: { type: String, required: true },
  created_date: { type: Date, default: Date.now }
});

export const ProjectStoryHistory = mongoose.model<IProjectStoryHistory>(
  "ProjectStoryHistory",
  ProjectStoryHistorySchema
);

import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Document } from "mongoose";

export interface ITaskHistory extends Document {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  formatted_history: string;
  created_date: Date;
}

export const TaskHistorySchema = new Schema<ITaskHistory>({
  id: { type: String, default: uuidv4, unique: true },
  task_id: { type: String, required: true },
  user_id: { type: String, required: true },
  user_name: { type: String },
  formatted_history: { type: String, required: true },
  created_date: { type: Date, default: Date.now },
});

export const TaskHistory = mongoose.model<ITaskHistory>("TaskHistory", TaskHistorySchema);

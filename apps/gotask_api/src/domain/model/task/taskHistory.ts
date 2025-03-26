import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Document } from "mongoose";

export interface ITaskHistory extends Document {
  id: string;
  task_id: string;
  loginuser_id: string;
  loginuser_name: string;
  formatted_history: string;
  created_date: Date;
}

export const TaskHistorySchema = new Schema<ITaskHistory>({
  id: { type: String, default: uuidv4 },
  task_id: { type: String, required: true },
  loginuser_id: { type: String, required: true },
  loginuser_name: { type: String },
  formatted_history: { type: String, required: true },
  created_date: { type: Date, default: Date.now }
});

export const TaskHistory = mongoose.model<ITaskHistory>("TaskHistory", TaskHistorySchema);

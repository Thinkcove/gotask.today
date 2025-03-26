import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Document } from "mongoose";

export interface ITaskComment extends Document {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  comment: string;
}

export const TaskCommentSchema = new Schema<ITaskComment>(
  {
    id: { type: String, default: uuidv4 },
    task_id: { type: String, required: true },
    user_id: { type: String, required: true },
    user_name: { type: String },
    comment: { type: String }
  },
  { timestamps: true }
);

export const TaskComment = mongoose.model<ITaskComment>("TaskComment", TaskCommentSchema);

import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Document } from "mongoose";

export interface ITaskComment extends Document {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  mentions: string[];  // Array of user IDs mentioned in the comment
}

export const TaskCommentSchema = new Schema<ITaskComment>(
  {
    id: { type: String, default: uuidv4 },
    task_id: { type: String, required: true },
    user_id: { type: String, required: true },
    user_name: { type: String },
    comment: { type: String },
    mentions: { type: [String], default: [] } // <-- New field added here
  },
  { timestamps: true }
);

export const TaskComment = mongoose.model<ITaskComment>("TaskComment", TaskCommentSchema);

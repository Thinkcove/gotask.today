import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ITaskComment, TaskCommentSchema } from "./taskComment";
import { ITaskHistory, TaskHistorySchema } from "./taskHistory";
import { TASK_SEVERITY, TASK_STATUS } from "../../constants/taskConstant";

export interface ITask extends Document {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  user_id: string;
  user_name: string;
  project_id: string;
  project_name: string;
  due_date: Date;
  created_on: Date;
  updated_on: Date;
  comment: ITaskComment[];
  history: ITaskHistory[];
}
const TaskSchema = new Schema<ITask>(
  {
    id: { type: String, default: uuidv4, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TO_DO,
      required: true,
    },
    severity: {
      type: String,
      enum: Object.values(TASK_SEVERITY),
      required: true,
    },
    user_id: { type: String, required: true },
    user_name: { type: String },
    project_id: { type: String, required: true },
    project_name: { type: String },
    due_date: { type: Date, required: true },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    comment: [TaskCommentSchema],
    history: [TaskHistorySchema],
  },
  { timestamps: true },
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);

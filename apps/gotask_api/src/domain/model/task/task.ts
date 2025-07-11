import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ITaskComment, TaskCommentSchema } from "./taskComment";
import { ITaskHistory, TaskHistorySchema } from "./taskHistory";
import { TASK_SEVERITY, TASK_STATUS } from "../../../constants/taskConstant";
import { ITimeSpentEntry, TimeSpentEntrySchema } from "./timespent";

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
  story_id?: string;
  due_date?: Date;
  created_on: Date;
  start_date?: Date;
  updated_on: Date;
  loginuser_id?: string;
  loginuser_name?: string;
  comment?: ITaskComment[];
  history?: ITaskHistory[];
  estimated_time: string;
  user_estimated: string;
  time_spent: ITimeSpentEntry[];
  time_spent_total: string;
  remaining_time: string;
  variation: string;
  created_by?: string;
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
      required: true
    },
    severity: {
      type: String,
      enum: Object.values(TASK_SEVERITY),
      required: true
    },
    user_id: { type: String, required: true },
    user_name: { type: String },
    project_id: { type: String, required: true },
    project_name: { type: String },

    story_id: { type: String },

    start_date: { type: Date },
    due_date: { type: Date },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    created_by: { type: String },

    user_estimated: { type: String, default: null },
    estimated_time: { type: String, default: null },
    time_spent: { type: [TimeSpentEntrySchema], default: [] },
    time_spent_total: { type: String, default: "0d0h" },
    remaining_time: { type: String, default: null },
    variation: { type: String, default: "0d0h" },
    comment: { type: [TaskCommentSchema] },
    history: { type: [TaskHistorySchema] }
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);

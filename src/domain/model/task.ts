import mongoose, { Schema } from "mongoose";
import { ITask } from "../interface/task";
import { TASK_SEVERITY, TASK_STATUS } from "../../constants/taskConstant";

const TaskSchema = new Schema<ITask>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
    due_date: { type: Date, required: true },
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
    assignee_id: { type: String, required: true },
    project_id: { type: String, required: true },
  },
  { timestamps: true },
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);

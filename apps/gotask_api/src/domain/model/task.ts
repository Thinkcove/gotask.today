import mongoose, { Schema } from "mongoose";
import { TASK_STATUS, TASK_SEVERITY } from "../../constants/taskConstant";
import { ITask } from "../interface/task";
import { v4 as uuidv4 } from "uuid";

const TaskSchema = new Schema<ITask>(
  {
    id: { type: String, default: uuidv4, unique: true }, // Auto-generated UUID
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
    assigned_to: { type: String, required: true }, // User's name
    project_name: { type: String, required: true }, // Project name
    due_date: { type: Date, required: true },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);

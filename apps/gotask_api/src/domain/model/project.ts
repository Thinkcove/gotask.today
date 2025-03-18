import mongoose, { Schema } from "mongoose";
import { IProject } from "../interface/project";
import { PROJECT_STATUS } from "../../constants/projectConstant";
import { v4 as uuidv4 } from "uuid";

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, default: uuidv4, unique: true }, // Auto-generated UUID
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.TO_DO,
      required: true,
    },
  },
  { timestamps: true },
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);

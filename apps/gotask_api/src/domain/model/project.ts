import mongoose, { Schema } from "mongoose";
import { IProject } from "../interface/project";
import { PROJECT_STATUS } from "../../constants/projectConstant";

const ProjectSchema = new Schema<IProject>(
  {
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

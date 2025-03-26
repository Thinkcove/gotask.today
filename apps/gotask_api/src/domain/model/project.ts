import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { PROJECT_STATUS } from "../../constants/projectConstant";
import { v4 as uuidv4 } from "uuid";

export interface IProject extends Document {
  id: string;
  name: string;
  description: string;
  status: string;
  user_id?: string[];
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, default: uuidv4, unique: true }, // Auto-generated UUID
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.TO_DO,
      required: true
    },
    user_id: [{ type: String }]
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);

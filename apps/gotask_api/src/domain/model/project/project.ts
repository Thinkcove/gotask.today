import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { PROJECT_STATUS } from "../../../constants/projectConstant";
import { v4 as uuidv4 } from "uuid";

export interface IProject extends Document {
  id: string;
  name: string;
  description: string;
  status: string;
  user_id?: string[]; //user id
  organization_id: string; // UUID from Organization model
  due_date?: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(PROJECT_STATUS),
      default: PROJECT_STATUS.TO_DO,
      required: true
    },
    user_id: [
      {
        type: String
      }
    ],
    organization_id: {
      type: String
    },
    due_date: { type: Date, required: false }
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);

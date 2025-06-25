import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPermission extends Document {
  id: string;
  user_id: string;
  user_name: string;
  date: Date;
  start_time: string;
  end_time?: string;
  comments: string[];
}

const PermissionSchema = new Schema<IPermission>(
  {
    id: { type: String, default: uuidv4, unique: true },
    user_id: { type: String, required: true },
    user_name: { type: String, required: true },
    date: { type: Date, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: false },
    comments: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Permission = mongoose.model<IPermission>("Permission", PermissionSchema);
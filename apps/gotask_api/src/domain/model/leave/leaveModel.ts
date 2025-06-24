import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export enum LEAVE_TYPE {
  SICK_LEAVE = "Sick leave",
  PERSONAL_LEAVE = "Personal leave"
}

export interface ILeave extends Document {
  id: string;
  user_id: string;
  user_name: string;
  from_date: Date;
  to_date: Date;
  leave_type: string;
  created_on: Date;
  updated_on: Date;
}

const LeaveSchema = new Schema<ILeave>(
  {
    id: { type: String, default: uuidv4, unique: true },
    user_id: { type: String, required: true },
    user_name: { type: String, required: true },
    from_date: { type: Date, required: true },
    to_date: { type: Date, required: true },
    leave_type: {
      type: String,
      enum: Object.values(LEAVE_TYPE),
      required: true
    },
    created_on: { type: Date, default: Date.now },
    updated_on: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Leave = mongoose.model<ILeave>("Leave", LeaveSchema);

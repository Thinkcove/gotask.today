import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/user";
import { v4 as uuidv4 } from "uuid";

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, default: uuidv4, unique: true }, // Auto-generated UUID
    name: { type: String, required: true },
    user_id: { type: String, required: true, unique: true }, // Email as unique ID
    status: { type: Boolean, default: true }, // Default: Active
    role: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);

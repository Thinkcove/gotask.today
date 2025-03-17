import mongoose, { Schema } from "mongoose";
import { IUser } from "../interface/user";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    user_id: { type: String, required: true, unique: true }, // Email as unique ID
    status: { type: Boolean, default: true }, // Default: Active
    role: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);

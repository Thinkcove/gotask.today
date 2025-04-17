import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IRoleAccess extends Document {
  id: string;
  role_id: string; // maps to Role.id
  access_id: string; // maps to Access.id
}

const RoleAccessSchema = new Schema<IRoleAccess>(
  {
    id: { type: String, default: uuidv4, unique: true },
    role_id: { type: String, required: true, ref: "Role" },
    access_id: { type: String, required: true, ref: "Access" }
  },
  { timestamps: true }
);

export const RoleAccess = mongoose.model<IRoleAccess>("RoleAccess", RoleAccessSchema);

import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IRole extends Document {
  id: string;
  name: string;
  access: string[]; // UUIDs of access records
}

export interface CreateRolePayload {
  name: string;
  accessIds?: string[];
}

const RoleSchema = new Schema<IRole>(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true, unique: true },
    access: [{ type: String, required: true }] // Storing access UUIDs, not ObjectId
  },
  { timestamps: true }
);

export const Role = model<IRole>("Role", RoleSchema);

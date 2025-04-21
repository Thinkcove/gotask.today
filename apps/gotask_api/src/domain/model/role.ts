import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IAccess } from "./access"; // Correct import of IAccess

export interface IRole extends Document {
  id: string;
  name: string; // e.g. Admin, Manager, Associate
  priority: number; // Lower = higher authority
  access: string[]; // UUIDs for Access model
}

// Defining the schema for Role
const RoleSchema = new Schema<IRole>(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true, unique: true },
    priority: { type: Number, required: true },
    access: [
      {
        type: String, // Storing UUIDs as strings for the access field
        required: true
      }
    ]
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Create the Role model based on the schema
export const Role = model<IRole>("Role", RoleSchema);

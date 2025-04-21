import { Document, Types } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IAccess } from "./access"; // Correct import of IAccess

export interface IRole extends Document {
  id: string;
  name: string; // e.g. Admin, Manager, Associate
  priority: number; // Lower = higher authority
  access: Types.ObjectId[]; // Reference to Access model (using ObjectId directly)
}

// Defining the schema for Role
const RoleSchema = new Schema<IRole>(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true, unique: true },
    priority: { type: Number, required: true },
    access: [
      {
        type: Schema.Types.ObjectId, // Direct reference to Access collection using ObjectId
        ref: "Access",               // Ensure that the relationship is populated when querying
        required: true
      }
    ]
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

// Create the Role model based on the schema
export const Role = mongoose.model<IRole>("Role", RoleSchema);

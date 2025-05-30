import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Interface for a single module's access config
export interface IAccessModule {
  module: string; // e.g. "User Management", "Task Management"
  actions: string[]; // e.g. ["READ", "EDIT"]
  restrictedFields: { [action: string]: string[] }; // e.g. { EDIT: ["name", "status"] }
}

// Main access interface extending mongoose.Document
export interface IAccess extends Document {
  id: string;
  name: string; // Role name (e.g. "HR Manager", "Associate")
  accesses: IAccessModule[]; // List of module-level access configs
}

// Schema for individual module access
const AccessModuleSchema = new Schema<IAccessModule>(
  {
    module: { type: String, required: true },
    actions: { type: [String], required: true, default: [] },
    restrictedFields: {
      type: Map,
      of: [String],
      required: true,
      default: {}
    }
  },
  { _id: false } // Prevent nested _id generation
);

// Main Access Schema
const AccessSchema = new Schema<IAccess>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    accesses: {
      type: [AccessModuleSchema],
      required: true,
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Exporting the Access model
export const Access = mongoose.model<IAccess>("Access", AccessSchema);

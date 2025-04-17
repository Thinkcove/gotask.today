import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Import Access model
import { IAccess } from "../model/access"; // Assuming Access model is in the same folder or adjust path

export interface IRole extends Document {
  id: string;
  name: string; // e.g. Admin, Manager, Associate
  priority: number; // Lower = higher authority
  access: IAccess[]; // References to Access model
}

const RoleSchema = new Schema<IRole>(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true, unique: true },
    priority: { type: Number, required: true },
    access: [
      { 
        type: Schema.Types.ObjectId, // Reference to Access collection
        ref: "Access",
        required: true
      }
    ]
  },
  { timestamps: true }
);

export const Role = mongoose.model<IRole>("Role", RoleSchema);

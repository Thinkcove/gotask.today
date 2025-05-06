import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IOrganization extends Document {
  id: string; // UUID used for referencing in projects
  name: string;
  address: string;
  mail_id: string;
  mobile_no: string;
  projects: string[]; // Array of project UUIDs
  users: string[]; // Array of user UUIDs
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    address: {
      type: String,
      default: ""
    },
    mail_id: {
      type: String,
      required: true,
      unique: true
    },
    mobile_no: {
      type: String,
      required: true,
      trim: true,
      default: ""
    },
    projects: {
      type: [String], // Array of strings
      default: []
    },
    users: {
      type: [String], // Array of strings
      default: []
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Ensure `id` is always included when converting to JSON
OrganizationSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});

export const Organization = mongoose.model<IOrganization>("Organization", OrganizationSchema);

import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IKpiAssignment extends Document {
  assignment_id: string;
  user_id: string; // References `id` from User schema
  template_id?: string; // References template_id from KpiTemplate
  kpiTitle: string;
  kpiDescription: string;
  measurement_Criteria: string;
  frequency: string;
  weightage: number;
  targetValue?: number;
  assigned_by: string; // References `id` from User schema
  reviewer_id?: string; // References `id` from User schema
  comments?: string;
  status: string;
  saveAsTemplate?: boolean;
  changeHistory: { changedBy: string; changedAt: Date; changes: Record<string, any> }[];
}

const KpiAssignmentSchema = new Schema<IKpiAssignment>(
  {
    assignment_id: {
      type: String,
      default: uuidv4,
      unique: true
    },
    user_id: {
      type: String,
      required: true,
      ref: "User" // Add reference to User model
    },
    template_id: {
      type: String
    },
    kpiTitle: {
      type: String,
      required: true
    },
    kpiDescription: {
      type: String,
      required: true
    },
    measurement_Criteria: {
      type: String,
      required: true,
      enum: ["Number", "Percentage", "Rating"]
    },
    frequency: {
      type: String,
      required: true,
      enum: ["Monthly", "Quarterly", "Annually"],
      default: "Quarterly"
    },
    weightage: {
      type: Number,
      required: true
    },
    targetValue: {
      type: Number
    },
    assigned_by: {
      type: String,
      required: true,
      ref: "User" // Add reference to User model
    },
    reviewer_id: {
      type: String,
      ref: "User" // Add reference to User model
    },
    comments: {
      type: String
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Locked"],
      default: "Active"
    },
    saveAsTemplate: {
      type: Boolean,
      default: false
    },
    changeHistory: [
      {
        changedBy: { type: String, required: true, ref: "User" }, // Reference User.id
        changedAt: { type: Date, default: Date.now },
        changes: { type: Object, default: {} }
      }
    ]
  },
  { timestamps: true }
);

export const KpiAssignment = mongoose.model<IKpiAssignment>("KpiAssignment", KpiAssignmentSchema);

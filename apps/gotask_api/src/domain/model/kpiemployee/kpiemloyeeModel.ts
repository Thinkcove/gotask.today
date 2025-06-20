import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { KPI_FREQUENCY, MEASUREMENT_CRITERIA } from "../../../constants/kpiConstants";

export interface IKpiAssignment extends Document {
  assignment_id: string;
  user_id: string;
  template_id?: string;
  kpiTitle: string;
  kpiDescription: string;
  measurement_criteria: string;
  frequency: string;
  weightage: number;
  targetValue?: number;
  assigned_by: string;
  reviewer_id?: string;
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
      ref: "User"
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
    measurement_criteria: {
      type: String,
      enum: Object.values(MEASUREMENT_CRITERIA),
      required: true
    },
    frequency: {
      type: String,
      enum: Object.values(KPI_FREQUENCY),
      default: KPI_FREQUENCY.QUARTERLY,
      required: true
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
      ref: "User"
    },
    reviewer_id: {
      type: String,
      ref: "User"
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

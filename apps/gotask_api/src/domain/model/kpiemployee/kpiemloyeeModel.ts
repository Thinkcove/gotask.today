import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { KPI_FREQUENCY,  STATUS } from "../../../constants/kpiConstants";

export interface IKpiAssignment extends Document {
  assignment_id: string;
  user_id: string;
  template_id?: string;
  kpi_Title: string;
  kpi_Description: string;
  measurement_criteria: string;
  frequency: string;
  weightage: number;
  target_Value?: number;
  assigned_by: string;
  reviewer_id?: string;
  comments?: string[];
  status: string;
  saveAs_Template?: boolean;
  change_History: { changedBy: string; changedAt: Date; changes: Record<string, any> }[];
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
    kpi_Title: {
      type: String,
      required: true
    },
    kpi_Description: {
      type: String
    },
    measurement_criteria: {
      type: String
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
    target_Value: {
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
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE
    },
    saveAs_Template: {
      type: Boolean,
      default: false
    },
    change_History: [
      {
        changed_By: { type: String },
        changed_At: { type: Date, default: Date.now },
        changes: { type: Object, default: {} }
      }
    ]
  },
  {
    timestamps: true,
    toObject: {
      versionKey: false,
      virtuals: false,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.id;
      }
    },
    toJSON: {
      versionKey: false,
      virtuals: false,
      transform: (_, ret) => {
        delete ret._id;
        delete ret.id;
      }
    }
  }
);

export const KpiAssignment = mongoose.model<IKpiAssignment>("KpiAssignment", KpiAssignmentSchema);

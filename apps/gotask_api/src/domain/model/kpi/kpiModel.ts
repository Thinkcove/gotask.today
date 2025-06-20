import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { KPI_FREQUENCY, MEASUREMENT_CRITERIA } from "../../../constants/kpiConstants";

export interface IKpiTemplate extends Document {
  template_id: string;
  title: string;
  description: string;
  measurement_criteria: string;
  frequency: string;
  isActive: boolean;
  changeHistory: { changedBy: string; changedAt: Date; changes: Record<string, any> }[];
}

const KpiTemplateSchema = new Schema<IKpiTemplate>(
  {
    template_id: {
      type: String,
      default: uuidv4,
      unique: true
    },
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
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
    isActive: {
      type: Boolean,
      default: true
    },
    changeHistory: [
      {
        changedBy: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changes: { type: Object, default: {} }
      }
    ]
  },
  { timestamps: true }
);

export const KpiTemplate = mongoose.model<IKpiTemplate>("KpiTemplate", KpiTemplateSchema);

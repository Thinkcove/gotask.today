import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { KPI_FREQUENCY, STATUS } from "../../../constants/kpiConstants";

export interface IKpiTemplate extends Document {
  template_id: string;
  title: string;
  description: string;
  measurement_criteria: string;
  frequency: string;
  status: string;
  change_history: { changedBy: string; changedAt: Date; changes: Record<string, any> }[];
}

const KpiTemplateSchema = new Schema<IKpiTemplate>(
  {
    template_id: {
      type: String,
      default: uuidv4
    },
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String
    },
    measurement_criteria: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      enum: Object.values(KPI_FREQUENCY),
      default: KPI_FREQUENCY.QUARTERLY,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(STATUS)
    },
    change_history: [
      {
        changedBy: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        changes: { type: Object, default: {} }
      }
    ]
  },
  { timestamps: true }
);
KpiTemplateSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const KpiTemplate = mongoose.model<IKpiTemplate>("KpiTemplate", KpiTemplateSchema);

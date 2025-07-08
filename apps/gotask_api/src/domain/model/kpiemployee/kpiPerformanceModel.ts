import { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";


export interface IKpiPerformance {
  performance_id: string;
  added_by:string;
  start_date: string;
  end_date:string;
  percentage: string;
  status: string;
  notes: string[];
  updated_at: Date;
}

export const KpiPerformanceSchema = new Schema(
    {
    performance_id: {
      type: String,
      default: uuidv4, 
      required: true,
      unique: true
    },
    added_by:{type:String, required: true},
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    percentage: { type: String, required: true },
    status: { type: String, required: true },
    notes: { type: [String], default: [] },
    updated_at: { type: Date, default: Date.now }
  },
);

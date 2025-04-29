import { Schema } from "mongoose";

export interface ITimeSpentEntry {
  date: string;
  time_logged: string; // e.g., "1d2h"
  start_time: string; 
  end_time: string;
}

export const TimeSpentEntrySchema = new Schema<ITimeSpentEntry>(
  {
    date: { type: String, required: true },
    time_logged: { type: String },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
  { _id: false }
);

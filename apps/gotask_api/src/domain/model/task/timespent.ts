import { Schema } from "mongoose";

export interface ITimeSpentEntry {
  date: string;
  time_logged: string; // e.g., "1d2h"
}

export const TimeSpentEntrySchema = new Schema<ITimeSpentEntry>(
  {
    date: { type: String, required: true },
    time_logged: { type: String, required: true }
  },
  { _id: false }
);

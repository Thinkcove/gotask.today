import mongoose, { Document, Schema, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IIssuesHistory extends Document {
  id: string;
  issuesId: string;
  userId: string;
  formatted_history: string;
  created_date: Date;
}

const IssuesHistorySchema: Schema<IIssuesHistory> = new Schema({
  id: { type: String, default: uuidv4 },
  issuesId: { type: String, required: true },
  userId: { type: String, required: true },
  formatted_history: { type: String, required: true },
  created_date: { type: Date, default: Date.now }
});

export const IssuesHistory: Model<IIssuesHistory> = mongoose.model<IIssuesHistory>(
  "IssuesHistory",
  IssuesHistorySchema
);

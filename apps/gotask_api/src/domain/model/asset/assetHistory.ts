import mongoose, { Document, Schema, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAssetHistory extends Document {
  id: string;
  assetId: string;
  userId: string;
  formatted_history: string;
  created_date: Date;
}

const AssetHistorySchema: Schema<IAssetHistory> = new Schema({
  id: { type: String, default: uuidv4 },
  assetId: { type: String, required: true },
  userId: { type: String, required: true },
  formatted_history: { type: String, required: true },
  created_date: { type: Date, default: Date.now }
});

export const AssetHistory: Model<IAssetHistory> = mongoose.model<IAssetHistory>(
  "AssetHistory",
  AssetHistorySchema
);

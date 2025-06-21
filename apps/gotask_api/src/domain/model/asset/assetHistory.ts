import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../user/user";

export interface IAssetHistory extends Document {
  id: string;
  assetId: string;
  userId: IUser;
  formatted_history: string;
  created_by: string;
  [key: string]: any;
}

const AssetHistorySchema = new Schema<IAssetHistory>(
  {
    id: { type: String, default: uuidv4 },
    assetId: { type: String, required: true },
    userId: { type: String, required: true },
    formatted_history: { type: String, required: true },
    created_by: { type: String }
  },
  {
    timestamps: true
  }
);

export const AssetHistory = model<IAssetHistory>("AssetHistory", AssetHistorySchema);

import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAssetType extends Document {
  id: string;
  name: string;
}

const AssetTypeSchema = new Schema<IAssetType>(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const AssetType = model<IAssetType>("AssetType", AssetTypeSchema);

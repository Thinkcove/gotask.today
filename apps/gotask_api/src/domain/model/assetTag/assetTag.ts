import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAssetTag extends Document {
  id: string;
  userId: string;
  assetId: string;
  active?: boolean;
  previouslyUsedBy?: string;
}

const AssetTagSchema = new Schema<IAssetTag>(
  {
    id: { type: String, default: uuidv4 },
    userId: { type: String, ref: "User", required: true },
    assetId: { type: String, ref: "Asset", required: true },
    previouslyUsedBy: { type: String },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const AssetTag = model<IAssetTag>("AssetTag", AssetTagSchema);

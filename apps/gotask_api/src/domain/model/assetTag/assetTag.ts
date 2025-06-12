import { Document, Schema, model, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ASSET_TAGS } from "../../../constants/assetConstant";

export interface IAssetTag extends Document {
  id: string;
  empId?: string;
  userId: String;
  assetId: String;
  actionType: "Assigned" | "Returned" | "Serviced";
  erk?: string;
  previouslyUsedBy?: string;
  active?: boolean;
}

const AssetTagSchema = new Schema<IAssetTag>(
  {
    id: { type: String, default: uuidv4, unique: true },
    empId: { type: String },
    userId: { type: String, ref: "User", required: true },
    assetId: { type: String, ref: "Asset", required: true },
    actionType: {
      type: String,
      enum: ASSET_TAGS,
      required: true
    },
    erk: { type: String },
    previouslyUsedBy: { type: String },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const AssetTag = model<IAssetTag>("AssetTag", AssetTagSchema);

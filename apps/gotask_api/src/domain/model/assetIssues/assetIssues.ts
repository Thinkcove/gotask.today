import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ASSET_ISSUES } from "../../../constants/assetConstant";

export interface IAssetIssue extends Document {
  assetId: string;
  reportedBy: string;
  issueType: string;
  description: string;
  status: (typeof ASSET_ISSUES)[keyof typeof ASSET_ISSUES];
  assignedTo?: string;
  comment?: string;
  updatedBy: string;
}

const AssetIssueSchema = new Schema<IAssetIssue>(
  {
    id: { type: String, default: uuidv4 },
    assetId: { type: String, required: true },
    reportedBy: { type: String, required: true },
    issueType: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ASSET_ISSUES,
      default: ASSET_ISSUES.OPEN
    },
    assignedTo: { type: String, ref: "User" },
    comment: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true
  }
);

export const AssetIssue = model<IAssetIssue>("AssetIssue", AssetIssueSchema);

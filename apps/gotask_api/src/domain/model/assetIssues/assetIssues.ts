import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAssetIssue extends Document {
  assetId: string;
  reportedBy: string;
  issueType: string;
  description: string;
  status: "Open" | "In Progress" | "Hold" | "Resolved";
  assignedTo?: string;
  comment?: string;
  updatedBy: string;
}

const AssetIssueSchema = new Schema<IAssetIssue>(
  {
    id: { type: String, default: uuidv4 },
    assetId: { type: String, ref: "User", required: true },
    reportedBy: { type: String, required: true },
    issueType: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Hold", "Resolved"],
      default: "Open"
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

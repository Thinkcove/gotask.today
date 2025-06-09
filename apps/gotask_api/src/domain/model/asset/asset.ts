import { Document, Schema, model, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAsset extends Document {
  id: string;
  deviceName: string;
  serialNumber: string;
  modelId: string;
  processor?: string;
  ram?: string;
  osId: string;
  seller?: string;
  dateOfPurchase?: Date;
  warrantyPeriod?: string;
  warrantyDate?: Date;
  antivirus?: string;
  isEncrypted?: boolean;
  lastServicedDate?: Date;
  commentService?: string;
  assetType?: string;
  active?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AssetSchema = new Schema<IAsset>(
  {
    id: { type: String, default: uuidv4 },
    deviceName: { type: String, required: true },
    serialNumber: { type: String, required: true },
    modelId: { type: String, ref: "Model", required: true },
    processor: { type: String },
    ram: { type: String },
    osId: { type: String, ref: "OS", required: true },
    seller: { type: String },
    dateOfPurchase: { type: Date },
    warrantyPeriod: { type: String },
    warrantyDate: { type: Date },
    antivirus: { type: String },
    isEncrypted: { type: Boolean, default: true },
    lastServicedDate: { type: Date },
    commentService: { type: String },
    assetType: { type: String },
    active: { type: Boolean, default: true },
    createdBy: { type: String },
    updatedBy: { type: String }
  },
  {
    timestamps: true
  }
);

export const Asset = model<IAsset>("Asset", AssetSchema);

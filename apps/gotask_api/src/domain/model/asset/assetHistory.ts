// import mongoose, { Document, Schema, Model } from "mongoose";
// import { v4 as uuidv4 } from "uuid";

// export interface IAssetHistory extends Document {
//   id: string;
//   assetId: string;
//   userId: string;
//   formatted_history: string;
//   created_date: Date;
// }

// const AssetHistorySchema: Schema<IAssetHistory> = new Schema({
//   id: { type: String, default: uuidv4 },
//   assetId: { type: String, required: true },
//   userId: { type: String, required: true },
//   formatted_history: { type: String, required: true },
//   created_date: { type: Date, default: Date.now }
// });

// export const AssetHistory: Model<IAssetHistory> = mongoose.model<IAssetHistory>(
//   "AssetHistory",
//   AssetHistorySchema
// );

import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../user/user";

export interface IAssetHistory extends Document {
  id: string;
  assetId: string;
  userId: IUser;
  formatted_history: string;
  deviceName?: string;
  serialNumber?: string;
  ram?: string;
  modelName?: string;
  os?: string;
  storage?: string;
  processor?: string;
  seller?: string;
  dateOfPurchase?: Date;
  warrantyPeriod?: string;
  warrantyDate?: Date;
  active?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;

  imeiNumber?: string;
  screenSize?: string;
  batteryCapacity?: string;
  cameraSpecs?: string;
  simType?: string;
  is5GSupported?: boolean;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: Date;

  antivirus?: string;
  recoveryKey?: string;
  isEncrypted?: boolean;
  lastServicedDate?: Date;
  commentService?: string;
  erk?: string;
  [key: string]: any;
}

const AssetHistorySchema = new Schema<IAssetHistory>(
  {
    id: { type: String, default: uuidv4 },
    assetId: { type: String, required: true },
    userId: { type: String, required: true },
    formatted_history: { type: String, required: true },
    deviceName: { type: String },
    serialNumber: { type: String },
    ram: { type: String },
    modelName: { type: String },
    os: { type: String },
    storage: { type: String },
    processor: { type: String },
    seller: { type: String },
    dateOfPurchase: { type: Date },
    warrantyPeriod: { type: String },
    warrantyDate: { type: Date },
    active: { type: Boolean, default: true },
    createdBy: { type: String },
    updatedBy: { type: String },

    imeiNumber: { type: String },
    screenSize: { type: String },
    batteryCapacity: { type: String },
    cameraSpecs: { type: String },
    simType: { type: String },
    is5GSupported: { type: Boolean },
    insuranceProvider: { type: String },
    insurancePolicyNumber: { type: String },
    insuranceExpiry: { type: Date },

    antivirus: { type: String },
    recoveryKey: { type: String },
    isEncrypted: { type: Boolean, default: false },
    lastServicedDate: { type: Date },
    commentService: { type: String },
    erk: { type: String }
  },
  {
    timestamps: true
  }
);

export const AssetHistory = model<IAssetHistory>("AssetHistory", AssetHistorySchema);

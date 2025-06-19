import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAsset extends Document {
  // Common fields
  id: string;
  typeId: string;
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

  // Mobile-specific fields
  imeiNumber?: string;
  screenSize?: string;
  batteryCapacity?: string;
  cameraSpecs?: string;
  simType?: string;
  is5GSupported?: boolean;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: Date;

  // Laptop-specific fields
  antivirus?: string;
  recoveryKey?: string;
  isEncrypted?: boolean;
  lastServicedDate?: Date;
  commentService?: string;
  erk?: string;
}

const AssetSchema = new Schema<IAsset>(
  {
    // Common fields
    id: { type: String, default: uuidv4 },
    typeId: { type: String, ref: "AssetType", required: true },
    deviceName: { type: String },
    serialNumber: { type: String },
    modelName: { type: String },
    os: { type: String },
    ram: { type: String },
    storage: { type: String },
    processor: { type: String },
    seller: { type: String },
    dateOfPurchase: { type: Date },
    warrantyPeriod: { type: String },
    warrantyDate: { type: Date },
    active: { type: Boolean, default: true },
    createdBy: { type: String },
    updatedBy: { type: String },

    // Mobile-specific fields
    imeiNumber: { type: String },
    screenSize: { type: String },
    batteryCapacity: { type: String },
    cameraSpecs: { type: String },
    simType: { type: String },
    is5GSupported: { type: Boolean },
    insuranceProvider: { type: String },
    insurancePolicyNumber: { type: String },
    insuranceExpiry: { type: Date },

    // Laptop-specific fields
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

export const Asset = model<IAsset>("Asset", AssetSchema);

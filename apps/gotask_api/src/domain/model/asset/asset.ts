import { Document, Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { SYSTEM_TYPES } from "../../../constants/assetConstant";

export interface IAsset extends Document {
  // Common fields
  id: string;
  typeId: string;
  deviceName?: string;
  systemType?: string;
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

  //Access card fields

  accessCardNo?: string;
  personalId?: string;

  // Laptop-specific fields
  antivirus?: boolean;
  recoveryKey?: string;
  isEncrypted?: boolean;
  lastServicedDate?: Date;
  commentService?: string;
  erk?: string;
  [key: string]: any;
}

const AssetSchema = new Schema<IAsset>(
  {
    // Common fields
    id: { type: String, default: uuidv4 },
    typeId: { type: String, ref: "AssetType", required: true },
    deviceName: { type: String },
    systemType: {
      type: String,
      enum: SYSTEM_TYPES,
      default: "Office System",
      required: true
    },
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
    antivirus: { type: Boolean, default: false },
    recoveryKey: { type: String },
    isEncrypted: { type: Boolean, default: false },
    lastServicedDate: { type: Date },
    commentService: { type: String },
    erk: { type: String },

    //Access card fields
    accessCardNo: { type: String },
    personalId: { type: String }
  },
  {
    timestamps: true
  }
);

export const Asset = model<IAsset>("Asset", AssetSchema);

import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { SYSTEM_TYPES } from "../../../constants/assetConstant";
import { IAssetsSchema } from "./interface/assetsSchema";

const AssetSchema = new Schema<IAssetsSchema>(
  {
    // Common fields
    id: { type: String, default: uuidv4 },
    typeId: { type: String, ref: "AssetType", required: true },
    deviceName: { type: String },
    systemType: {
      type: String,
      enum: SYSTEM_TYPES
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
    personalId: { type: String },
    issuedOn: { type: String },
    accessCardNo2: { type: String },

    //Common fields for printer and biometric
    Location: { type: String },
    connectivity: { type: String },

    //Printer fields
    printerType: { type: String },
    specialFeatures: { type: String },
    printerOutputType: { type: String },
    supportedPaperSizes: { type: String },

    //Biometric fields
    capacity: { type: String },
    authenticationModes: { type: String }, //Eg: Fingerprint, Card, Password
    display: { type: String },
    cloudAndAppBased: { type: Boolean },

    //AC fields
    acType: { type: String },
    energyRating: { type: String },
    powerConsumption: { type: String },
    coolingCoverage: { type: String },
    inverterType: { type: String }
  },
  {
    timestamps: true
  }
);

export const Asset = model<IAssetsSchema>("Asset", AssetSchema);

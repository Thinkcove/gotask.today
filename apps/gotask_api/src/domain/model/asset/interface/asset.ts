import { Document } from "mongoose";

export interface IAsset extends Document {
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
  [key: string]: any;
}

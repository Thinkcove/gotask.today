export interface IAsset {
  type: string;
}

export interface IAssetType {
  id: string;
  name: string;
}

export interface IAssetAttributes {
  id?: string;
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
  antivirus?: string;
  recoveryKey?: string;
  isEncrypted?: boolean;
  lastServicedDate?: Date;
  commentService?: string;
}

export interface IAsset {
  type: string;
}

export interface IAssetAttributes {
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

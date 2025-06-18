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
  assetType?: IAssetType;
}

export interface IAssetTags {
  id?: string;
  userId: string;
  assetId: string;
  actionType: string;
  erk: string;
  previouslyUsedBy: string;
}

interface AssetDetails {
  modelName: string;
  deviceName: string;
}

interface AssignedDetails {
  name: string;
  user_id: string;
}

export interface IAssetIssues {
  id?: string;
  assetId: string;
  reportedBy: string;
  issueType: string;
  description: string;
  status: string;
  assignedTo: string;
  comment: string;
  updatedBy: string;
  assetDetails?: AssetDetails;
  assigned?: AssignedDetails;
  reportedDetails?: AssignedDetails;
}

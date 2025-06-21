import { User } from "../../user/interfaces/userInterface";

export interface IAsset {
  type: string;
}

export interface IAssetType {
  id: string;
  name: string;
}

export interface ITagData {
  id?: string;
  userId?: string;
  user?: User;
  actionType?: string;
  createdAt?: string;
}

export interface IAssetHistory {
  id?: string;
  userId?: string;
  assetId?: string;
  formatted_history?: string;
  created_date?: string;
  userData?: User;
  tagData?: ITagData;
}

export interface IIssuesHistory {
  id: string;
  issuesId: string;
  userId?: User;
  formatted_history: string;
  created_date: Date;
  created_by: string;
  userData: User;
}

export interface IAssetAttributes {
  id?: string;
  tags?: ITagData;
  typeId: string;
  deviceName?: string;
  serialNumber?: string;
  ram?: string;
  modelName?: string;
  os?: string;
  storage?: string;
  processor?: string;
  seller?: string;
  dateOfPurchase?: Date | "";
  erk?: string;
  warrantyPeriod?: string;
  warrantyDate?: Date | "";
  active?: boolean;
  createdBy?: string;
  updatedBy?: string;
  antivirus?: string;
  recoveryKey?: string;
  isEncrypted?: boolean;
  lastServicedDate?: Date | "";
  commentService?: string;
  assetType?: IAssetType;
  tagData?: ITagData[];
  userId?: string;

  //mobile
  imeiNumber?: string;
  screenSize?: string;
  batteryCapacity?: string;
  cameraSpecs?: string;
  simType?: string;
  is5GSupported?: boolean;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiry?: Date | "";

  // history
  assetHistory?: IAssetHistory[];
}

export interface IAssetTags {
  id?: string;
  userId: string;
  assetId: string;
  actionType: string;
  erk: string;
  previouslyUsedBy: string;
  tags?: string;
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
  issuesHistory?: IIssuesHistory[];
}

export interface IIssuesHistories {
  id: string;
  issuesId: string;
  formatted_history: string;
  created_date: Date | "";
  created_by: string;
  userData?: User;
}

import { IAssetAttributes } from "../../asset/interface/asset";

export interface ISkill {
  name: string;
  skill_id?: string;
  proficiency: number; 
  experience?: number; 
}

export interface ICertificate {
  _id?: string; 
  name: string;
  obtained_date: Date | string; 
  notes?: string;
}

export interface IIncrementHistory {
  date: string;
  ctc: number;
}

export interface IUserField {
  name: string;
  status: boolean;
  organization: string[];
  roleId: string;
  user_id: string;
  mobile_no?: string;
  joined_date?: Date | string;
  emp_id?: string;
  first_name: string;
  last_name: string;
  skills?: ISkill[];
  certificates?: ICertificate[];
  increment_history?: IIncrementHistory[];
}

export interface User {
  id: string;
  name: string;
  status: boolean;
  user_id: string;
  roleId: RoleData;
  role: RoleData;
  createdAt: string;
  updatedAt: string;
  projects: { id: string; name: string }[];
  organization: string[];
  organizations: { id: string; name: string; address: string }[];
  projectDetails: { id: string; name: string; description: string; status: string }[];
  orgDetails: { id: string; name: string }[];
  mobile_no?: string;
  joined_date?: Date | string;
  emp_id?: string;
  first_name: string;
  last_name: string;
  assetDetails?: IAssetAttributes[];
  skills?: ISkill[];
  certificates?: ICertificate[];
  increment_history?: IIncrementHistory[];
}

export interface RoleData {
  _id: string;
  id: string;
  name: string;
}

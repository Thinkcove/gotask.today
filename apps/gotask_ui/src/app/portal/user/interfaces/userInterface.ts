export interface IUserField {
  name: string;
  status: boolean;
  organization: string[];
  roleId: string;
  user_id: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  status: boolean;
  user_id: string;
  roleId: RoleData;
  createdAt: string;
  updatedAt: string;
  projects: { id: string; name: string }[];
  organization: string[];
  organizations: { id: string; name: string; address: string }[];
  projectDetails: { id: string; name: string; description: string; status: string }[];
}

export interface RoleData {
  id: string;
  name: string;
}

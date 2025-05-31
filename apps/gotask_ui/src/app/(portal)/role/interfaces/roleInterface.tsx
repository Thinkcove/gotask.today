export interface Role {
  id: string;
  name: string;
  priority?: number;
  access: string[]; // array of access IDs or names
  accessDetails: AccessDetail[]; // detailed info per access
  createdAt: string;
  updatedAt: string;
  accessIds: string[]; // possibly duplicate of access? Clarify usage
}

export interface AccessDetail {
  id: string;
  name: string;
  application: Application[];
}

export interface Application {
  access: string;
  actions: string[];
  restrictedFields?: { [key: string]: string[] };
  _id: string;
}

export interface IRole {
  name: string;
  accessIds: string[];
}

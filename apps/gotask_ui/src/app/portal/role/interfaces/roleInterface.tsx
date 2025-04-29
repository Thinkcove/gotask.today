export interface Role {
  id: string;
  name: string;
  priority?: number;
  access: string[];
  accessDetails: AccessDetail[];
  createdAt: string;
  updatedAt: string;
  accessIds: string[];
}

export interface AccessDetail {
  id: string;
  name: string;
  application: Application[];
}

export interface Application {
  access: string;
  actions: string[];
  _id: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  mail_id: string;
  createdAt: string;
  updatedAt: string;
  projects: string[];
  users: string[];
  projectDetails: { id: string; name: string; status: string; description: string }[];
  userDetails: { id: string; name: string; user_id: string; status: string }[];
}

export interface IOrganizationField {
  id?: string;
  name: string;
  address: string;
  mail_id: string;
  projects: string[];
  users: string[];
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  mail_id: string;
  mobile_no: string;
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
  mobile_no: string;
  projects: string[];
  users: string[];
}

export const ORGANIZATION_FORM_FIELDS = ["name", "address", "mail_id", "mobile_no"];

export interface IProjectField {
  name: string;
  description: string;
  status: string;
  organization_id: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  organization_id: string;
  users: { id: string; name: string; user_id: string }[];
}

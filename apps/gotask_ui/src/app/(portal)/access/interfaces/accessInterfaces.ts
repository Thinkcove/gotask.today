// Represents a single access option with allowed actions and optional restricted fields
export interface AccessOption {
  access: string;
  actions: string[];
  restrictedFields?: { [key: string]: string[] }; // optional, as used in your service
}

// Actual permissions assigned to an access role
export interface ApplicationPermission {
  access: string;
  actions: string[];
  restrictedFields?: { [key: string]: string[] }; // optional
}

// Represents the full access role entity as returned by the backend
export interface AccessRole {
  id: string;
  name: string;
  application: ApplicationPermission[]; // list of permissions with optional restrictedFields
  createdAt: string;
}

// API response structure when fetching an access role
export interface AccessRoleResponse {
  success: boolean;
  message: string;
  data: AccessRole | null;
}

// Simplified structure used for dropdowns or UI selections
export interface AccessData {
  id: string;
  name: string;
  accesses?: AccessOption[]; // note: "accesses" for UI dropdown use
  createdAt?: string;
  updatedAt?: string;
}

export const ACCESS_FORM_FIELDS = ["name", "permissions", "restrictedFields"];

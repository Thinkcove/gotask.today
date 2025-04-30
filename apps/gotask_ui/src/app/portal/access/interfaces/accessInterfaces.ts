// interfaces/accessInterfaces.ts

// Option received from the backend representing available modules and actions
export interface AccessOption {
  access: string;     // Module name (e.g., "user", "project")
  actions: string[];  // Available actions (e.g., ["create", "read", "update", "delete"])
}

// Actual permissions assigned to an access role
export interface ApplicationPermission {
  access: string;      // Module name
  actions: string[];   // Allowed actions for this role on that module
}

// Represents the access role entity
export interface AccessRole {
  id: string;                        // UUID
  name: string;                      // Role name (e.g., "Admin")
  application: ApplicationPermission[];  // Module-action pairs
}

// API response structure when fetching an access role
export interface AccessRoleResponse {
  success: boolean;
  message: string;
  data: AccessRole | null;
}

// Used for dropdowns or selections (optional)
export interface AccessData {
  id: string;
  name: string;
  accesses: AccessOption[];
}

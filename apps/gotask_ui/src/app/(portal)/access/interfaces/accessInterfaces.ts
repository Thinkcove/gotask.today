// Single access option from config (for dropdowns, etc.)
export interface AccessOption {
  access: string;
  actions: string[];
  fields?: {
    [action: string]: string[];  // e.g. "read": ["name", "user_id", ...]
  };
}

// Permission assigned in a role (part of application array)
export interface ApplicationPermission {
  access: string;
  actions: string[];
}

// Access role entity returned from backend
export interface AccessRole {
  id: string;
  name: string;
  application: ApplicationPermission[];  // array of permissions
  createdAt: string;
  updatedAt?: string;
}

// API response wrapper for AccessRole (single)
export interface AccessRoleResponse {
  success: boolean;
  message: string;
  data: AccessRole | null;
}

// Used for UI dropdowns or lists of roles
export interface AccessData {
  id: string;
  name: string;
  accesses: ApplicationPermission[];  // note: renamed from `accesses` instead of `application`
  createdAt?: string;
  updatedAt?: string;
}


export interface AccessOption {
  access: string;    
  actions: string[]; 
}

// Actual permissions assigned to an access role
export interface ApplicationPermission {
  access: string;      
  actions: string[];  
}

// Represents the access role entity
export interface AccessRole {
  id: string;                       
  name: string;                      
  application: ApplicationPermission[]; 
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
  createdAt?: string;
  updatedAt?: string;
}

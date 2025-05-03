// src/constants/access/applications.ts

export const APPLICATIONS = {
  USER_MANAGEMENT: "User Management",
  TASK_MANAGEMENT: "Task Management",
  PROJECT_MANAGEMENT: "Project Management",
  ROLE_MANAGEMENT: "Role Management",
  ACCESS_MANAGEMENT: "Access Management",
  ORGANIZATION_MANAGEMENT: "Organization Management"
} as const;

export type ApplicationName = (typeof APPLICATIONS)[keyof typeof APPLICATIONS];

// src/constants/access/actions.ts

export const ACTIONS = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  VIEW: "VIEW"
} as const;

export type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS];

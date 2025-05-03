export const APPLICATIONS = {
  USER: "User Management",
  TASK: "Task Management",
  PROJECT: "Project Management",
  ROLE: "Role Management",
  ACCESS: "Access Management",
  ORGANIZATION: "Organization Management"
} as const;

export type ApplicationName = (typeof APPLICATIONS)[keyof typeof APPLICATIONS];

export const ACTIONS = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  VIEW: "VIEW",
  ASSIGN: "ASSIGN",
  UNASSIGN: "UNASSIGN",
  REVOKE_ACCESS: "REVOKE"
} as const;

export type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS];

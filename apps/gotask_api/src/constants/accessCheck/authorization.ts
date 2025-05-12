export const APPLICATIONS = {
  USER: "User Management",
  TASK: "Task Management",
  PROJECT: "Project Management",
  ROLE: "Role Management",
  ACCESS: "Access Management",
  ORGANIZATION: "Organization Management",
  REPORT: "User Report"
} as const;

export type ApplicationName = (typeof APPLICATIONS)[keyof typeof APPLICATIONS];

export const ACTIONS = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "EDIT",
  DELETE: "DELETE",
  VIEW: "VIEW",
  ASSIGN: "ASSIGN",
  UNASSIGN: "UNASSIGN",
  INVOKE_ACCESS: "INVOKE_ACCESS",
  REVOKE_ACCESS: "REVOKE_ACCESS"
} as const;

export type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS];

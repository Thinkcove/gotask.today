export const APPLICATIONS = {
  USER: "User Management",
  TASK: "Task Management",
  PROJECT: "Project Management",
  ROLE: "Role Management",
  ACCESS: "Access Management",
  ORGANIZATION: "Organization Management",
  CHATBOT: "Chatbot Management",
  UPLOAD: "Upload"
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
  ASSIGN_ACCESS: "ADD ACCESS",
  REVOKE_ACCESS: "REMOVE ACCESS"
} as const;

export type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS];

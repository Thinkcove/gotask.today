export interface IUserTimeLogInput {
  from: string;
  to: string;
  users: string[]; // MUST be array
  projectIds?: string[]; // optional, but should still be array
  includeTasks?: boolean;
  includeProject?: boolean;
}

export interface IUserTimeLogOutput {
  success: boolean;
  data?: any;
  message?: string;
}

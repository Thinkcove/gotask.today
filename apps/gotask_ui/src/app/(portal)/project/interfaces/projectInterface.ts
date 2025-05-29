export interface IProjectField {
  name: string;
  description: string;
  status: string;
  organization_id: string;
}

export const PROJECT_STATUS = {
  TO_DO: "to-do",
  IN_PROGRESS: "in-progress",
  HOLD: "hold",
  COMPLETED: "completed"
};

export const PROJECT_WORKFLOW = {
  [PROJECT_STATUS.TO_DO]: [PROJECT_STATUS.IN_PROGRESS, PROJECT_STATUS.HOLD],
  [PROJECT_STATUS.IN_PROGRESS]: [PROJECT_STATUS.HOLD, PROJECT_STATUS.COMPLETED],
  [PROJECT_STATUS.HOLD]: [PROJECT_STATUS.TO_DO, PROJECT_STATUS.IN_PROGRESS],
  [PROJECT_STATUS.COMPLETED]: []
};

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

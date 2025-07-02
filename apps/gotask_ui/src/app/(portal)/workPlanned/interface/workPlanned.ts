// User interface for filters
export interface User {
  id: string;
  name: string;
}

export interface WorkPlannedEntry {
  user_id: string;
  user_name: string;
  start_date: string | null;
  end_date: string | null;
  user_estimated: string | number | null;
  task_id?: string;
  task_title?: string;
  status: string;
  project_id?: string;
  project_name?: string;
}

export interface WorkPlannedGridProps {
  data: WorkPlannedEntry[];
  fromDate: string;
  toDate: string;
  selectedProjects: string[];
}

// API Response interface
export interface WorkPlannedApiResponse {
  success: boolean;
  data: WorkPlannedEntry[];
  count?: number;
  error?: string;
}

export interface Payload {
  fromDate: string;
  toDate: string;
  userIds: string[];
  selectedProjects: string[];
}

export interface Filters {
  fromDate: string;
  toDate: string;
  userIds: string[];
  projectIds: string[];
}


export interface WorkPlannedGridProps {
  data: WorkPlannedEntry[];
  fromDate: string;
  toDate: string;
  selectedProjects: string[];
  leaveData?: LeaveEntry[];
}

export interface LeaveEntry {
  user_id: string;
  user_name: string;
  from_date: string;
  to_date: string;
  leave_type: string;
  id: string;
  created_on: string;
  updated_on: string;
  createdAt: string;
  updatedAt: string;
}

// Group tasks by user
export interface GroupedTasks {
  [userKey: string]: {
    userName: string;
    tasks: WorkPlannedEntry[];
    totalEstimation: number;
    leaves: LeaveEntry[];
  };
}
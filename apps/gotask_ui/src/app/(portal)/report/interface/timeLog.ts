export interface TimeLogEntry {
  user_name: string;
  project_name?: string;
  project_id?: string;
  task_title?: string;
  status?: string;
  task_id: string;
  date: string;
  total_time_logged: string[];
  user_id?: string;
}

export interface TimeLogGridProps {
  data: TimeLogEntry[];
  fromDate: string;
  toDate: string;
  showTasks: boolean;
  selectedProjects: string[];
  selectedUsers: string[];
}

export interface User {
  id: string;
  name: string;
}

export type GroupedLogs = Record<string, Record<string, number>>;

export interface TaskLog {
  task: string;
  dailyLogs: Record<string, number>;
  taskId: string;
  status: string;
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

export interface EnhancedTimeLogGridProps extends TimeLogGridProps {
  leaveData?: LeaveEntry[];
}

export interface PermissionEntry {
  _id: string;
  user_id: string;
  user_name: string;
  date: string;
  start_time: string;
  end_time: string;
  comments: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Updated interface to include permission data
export interface EnhancedTimeLogGridPropsWithPermissions extends EnhancedTimeLogGridProps {
  permissionData?: PermissionEntry[];
}

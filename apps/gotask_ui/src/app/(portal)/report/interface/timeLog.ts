export interface TimeLogEntry {
  user_name: string;
  project_name?: string;
  project_id?: string;
  task_title?: string;
  task_id: string;
  date: string;
  total_time_logged: string[];
}

export interface TimeLogGridProps {
  data: TimeLogEntry[];
  fromDate: string;
  toDate: string;
  showTasks: boolean;
  selectedProjects: string[];
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
}
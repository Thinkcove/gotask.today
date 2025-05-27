export interface IFormField {
  title: string;
  description: string;
  status: string;
  severity: string;
  user_id: string;
  user_name?: string;
  project_id: string;
  project_name?: string;
  created_on: string;
  due_date: string;
  projects?: string;
}

export interface IGroup {
  total_count: number;
  id: string;
  project_name: string;
  user_name: string;
  tasks: [];
}
export interface ITask {
  variation?: string;
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  user_id: string;
  user_name: string;
  project_id: string;
  project_name: string;
  createdAt: string;
  created_on: string;
  updatedAt: string;
  updated_on: string;
  due_date: string;
  history: ITaskHistory[];
  comment: ITaskComment[];
  estimated_time?: string;
  time_spent?: TimeEntry[];
  time_spent_total?: string;
  remaining_time?: string;
  time_entries?: Array<{ date: string; hours: number }>;
}

export interface ITaskHistory {
  created_date: string;
  formatted_history: string;
  id: string;
  task_id: string;
  loginuser_id: string;
  loginuser_name: string;
}

export interface ITaskComment {
  id?: string;
  task_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskPayload = {
  page?: number;
  page_size?: number;
  search_vals?: string[][];
  search_vars?: string[][];
  min_date?: string;
  max_date?: string;
  date_var?: string;
  more_variation?: string;
  less_variation?: string;
};

export type Project = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
};

export type TaskFilterType = {
  min_date?: string;
  max_date?: string;
  date_var?: string;
  search_vals?: string[][];
  search_vars?: string[][];
  more_variation?: string;
  less_variation?: string;
};

export type FilterValues = {
  severity: string[];
  status: string[];
  dateFrom: string;
  dateTo: string;
  projects: string[];
  users: string[];
  variationType: "" | "more" | "less";
  variationDays: number;
};

export interface TimeOption {
  label: string;
  value: string;
}

export interface TimeEntry {
  date: string;
  start_time: string;
  end_time: string;
}

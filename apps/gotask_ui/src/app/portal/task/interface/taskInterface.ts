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

export type ProjectTaskPayload = {
  page: number;
  page_size: number;
  task_page: number;
  task_page_size: number;
  search_vals?: string[][];
  search_vars?: string[][];
};

export type Project = {
  id: string;
  name: string;
};

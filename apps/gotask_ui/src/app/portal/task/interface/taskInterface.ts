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
  user_id: string;
  user_name: string;
}

export interface ITaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

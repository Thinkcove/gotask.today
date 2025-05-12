// interfaces/timeReport.ts
export interface TimeReportRequest {
  fromDate: string;
  toDate: string;
  userIds: string[];
  showTasks?: boolean;
  showProjects?: boolean;
}

export interface TimeReportResponse {
  success: boolean;
  data: Array<{
    user_id: string;
    date: string;
    task_id?: string;
    task_title?: string;
    project_id?: string;
    project_name?: string;
    total_time_logged: string[]; // Could be parsed to total minutes
  }>;
}

export interface Template {
  kpi_Description: string;
  kpi_Title: string;
  id: string;
  title: string;
  description?: string;
  measurement_criteria: number;
  frequency?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  comments?: string;
  assignment_id: string;
  target_value: number;
  assigned_by: string;
  reviewer_id: string;
  weightage: number;
  actual_value?: number;
}

export interface KpiAssignment {
  assignment_id: string;
  user_id: string;
  template_id: string;
  kpi_Title: string;
  kpi_Description: string;
  measurement_criteria: string;
  frequency: string;
  weightage: number;
  target_value?: number;
  actual_value?: number;
  assigned_by: string;
  reviewer_id: string;
  status: string;
  comments: string[] | string;
  change_History?: any;
}

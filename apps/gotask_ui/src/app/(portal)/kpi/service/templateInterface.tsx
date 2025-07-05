export interface Template {
  kpi_Description: string;
  kpi_Title: string;
  id: string;
  title: string;
  description?: string;
  measurement_criteria?: string;
  frequency?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  comments?: string;
  assignment_id: string;
  target_value: string;
  assigned_by: string;
  reviewer_id: string;
  weightage?: string;
  actual_value?: number;
}

export interface KpiAssignment {
  assignment_id: string;
  user_id: string;
  template_id: string;
  description?: string;
  kpi_Title: string;
  kpi_Description: string;
  measurement_criteria?: string;
  frequency: string;
  weightage: string;
  target_value?: string;
  actual_value?: string;
  assigned_by: string;
  reviewer_id: string;
  status: string;
  comments: string[] | string;
  change_History?: string[] | string;
}

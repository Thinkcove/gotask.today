import { IFormField } from "@/app/(portal)/task/interface/taskInterface";

// constants/taskFields.ts
export const TASK_FORM_FIELDS: (keyof IFormField)[] = [
  "title",
  "description",
  "status",
  "severity",
  "user_id",
  "user_name",
  "project_id",
  "project_name",
  "created_on",
  "due_date"
];

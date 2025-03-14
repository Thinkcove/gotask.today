import { Document } from "mongoose";

export interface ITask extends Document {
  name: string;
  description: string;
  created_on: Date;
  updated_on: Date;
  due_date: Date;
  status: string;
  severity: string;
  assignee_id: string;
  project_id: string;
}

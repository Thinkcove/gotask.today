import { Document } from "mongoose";

export interface ITask extends Document {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  assigned_to: string;
  project_name: string;
  due_date: Date;
  created_on: Date;
  updated_on: Date;
}

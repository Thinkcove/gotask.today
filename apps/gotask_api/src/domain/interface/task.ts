import { Document } from "mongoose";

export interface ITask extends Document {
  id: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  user_id: string;
  user_name: string;
  project_id: string;
  project_name: string;
  due_date: Date;
  created_on: Date;
  updated_on: Date;
}

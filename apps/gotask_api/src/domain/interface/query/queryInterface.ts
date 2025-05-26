import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { QueryHistory } from "../../model/query/queryModel";

export interface ParsedQuery {
  keywords?: string[];
  dates?: Date[];
  empcode?: string | null;
  empname?: string | null;
  id?: string | null;
  project_id?: string | null;
  project_name?: string | null;
  timeRange?: string | null;
}

export interface ExtendedParsedQuery extends ParsedQuery {
  user_id?: string | null;
  name?: string | null;
  date?: string | undefined;
  hoursLate?: boolean;
  employeeDetails?: boolean;
  averageOutTime?: boolean;
  averageInTime?: boolean;
  dateRange?: { start: Date; end: Date } | undefined;
  workinghours?: boolean;
  after10am?: boolean;
  latelogoff?: boolean;
  projectDetails?: boolean;
  organizationDetails?: boolean;
  organizationName?: string | null;
  taskDetails?: boolean;
  hoursSpent?: boolean;
  dueDate?: boolean;
  overdueWork?: boolean;
  isFinished?: boolean;
  projectStatus?: boolean;
  employeeCount?: boolean;
  employees?: boolean;
  employeeHours?: boolean;
  listProjects?: boolean;
  workAfterDue?: boolean;
  isAttendanceQuery?: boolean;
  taskStatus?: boolean;
  taskSeverity?: boolean;
  assignedEmployees?: boolean;
  openTasks?: boolean;
  completedTasks?: boolean;
  projectAssignedHours?: boolean;
  taskName?: string | undefined;
}

export interface IQueryHistory extends Document {
  id: string;
  query: string;
  timestamp: Date;
  parsedQuery: ExtendedParsedQuery;
  response: string;
  conversationId: string;
  type: string;
}

export const createQueryHistory = async (queryData: IQueryHistory): Promise<IQueryHistory> => {
  const newQuery = new QueryHistory(queryData);
  return await newQuery.save();
};

export const findQueryHistory = async (limit: number): Promise<IQueryHistory[]> => {
  return await QueryHistory.find({})
    .sort({ timestamp: -1 })
    .limit(limit)
    .select("query timestamp response conversationId type id")
    .lean();
};

export const deleteAllQueryHistory = async (): Promise<void> => {
  await QueryHistory.deleteMany({});
};

export const deleteQueryHistoryByConversationId = async (conversationId: string): Promise<void> => {
  await QueryHistory.deleteMany({ conversationId });
};

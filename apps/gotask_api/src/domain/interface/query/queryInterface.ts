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

export interface IQueryHistory extends Document {
  id: string;
  query: string;
  timestamp: Date;
  parsedQuery: Record<string, any>;
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

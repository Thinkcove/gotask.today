import { IQueryHistory, QueryHistory } from "../../model/query/queryModel";

export const getQueryHistoryByConversationId = async (
  conversationId: string
): Promise<IQueryHistory[]> => {
  return await QueryHistory.find({ conversationId })
    .sort({ timestamp: -1 })
    .select("query timestamp response conversationId type id")
    .lean();
};

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

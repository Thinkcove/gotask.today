import { AssetHistory, IAssetHistory } from "../../model/asset/assetHistory";
import { AssetIssue } from "../../model/assetIssues/assetIssues";
import { IIssuesHistory, IssuesHistory } from "../../model/assetIssues/assetIssuesHistory";

export const createAssetHistory = async (payload: any): Promise<IAssetHistory> => {
  const newHistory = new AssetHistory(payload);
  return await newHistory.save();
};

export const getAssetHistoryById = async (assetId: string) => {
  return await AssetHistory.find({ assetId });
};

export const getIssuesHistoryById = async (issuesId: string) => {
  return await IssuesHistory.find({ issuesId });
};

export const createIssuesHistory = async (payload: any): Promise<IIssuesHistory> => {
  const newHistory = new IssuesHistory(payload);
  return await newHistory.save();
};

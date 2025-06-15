import { AssetIssue, IAssetIssue } from "../../model/assetIssues/assetIssues";
import { AssetTag, IAssetTag } from "../../model/assetTag/assetTag";

const createResource = async (resourceData: IAssetTag): Promise<IAssetTag> => {
  const newResource = new AssetTag(resourceData);
  return await newResource.save();
};

const createAssetIssues = async (data: IAssetIssue): Promise<IAssetIssue> => {
  const assetIssues = new AssetIssue(data);
  return await assetIssues.save();
};

export const updateAssetIssue = async (
  id: string,
  updateData: Partial<IAssetIssue>
): Promise<IAssetIssue | null> => {
  return await AssetIssue.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
};

const getAssetIssueById = async (id: string) => {
  return await AssetIssue.findOne({ id });
};

const getAllTags = async (): Promise<IAssetTag[]> => {
  return await AssetTag.find();
};

export { createResource, createAssetIssues, getAssetIssueById, getAllTags };

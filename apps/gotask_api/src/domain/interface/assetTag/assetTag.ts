import { AssetIssue, IAssetIssue } from "../../model/assetIssues/assetIssues";
import { AssetTag, IAssetTag } from "../../model/assetTag/assetTag";

const createResource = async (resourceData: IAssetTag, assetId?: string): Promise<IAssetTag> => {
  const payload = {
    ...resourceData,
    assetId
  };
  const newResource = new AssetTag(payload);
  return await newResource.save();
};

const createTag = async (payload: any): Promise<IAssetTag> => {
  const newResource = new AssetTag(payload);
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

const getTagsByAssetId = async (assetId: string) => {
  return await AssetTag.findOne({ assetId });
};

const getAllTags = async (): Promise<IAssetTag[]> => {
  return await AssetTag.find();
};

const getAllIssues = async (): Promise<IAssetTag[]> => {
  return await AssetIssue.find();
};

const getTagsByTypeId = async (assetId: string) => {
  return await AssetTag.find({ assetId });
};

const getTagById = async (id: string) => {
  return await AssetTag.findOne({ id });
};

const updateTag = async (id: string, payload: Partial<IAssetTag>): Promise<IAssetTag | null> => {
  return await AssetTag.findOneAndUpdate(
    { id },
    { $set: payload },
    {
      new: true,
      runValidators: true
    }
  ).lean();
};

const getAssetByUserId = async (userId: string): Promise<IAssetTag[]> => {
  return await AssetTag.find({ userId });
};

const getIssuesByUserId = async (reportedBy: string, assetId: string): Promise<IAssetIssue[]> => {
  return await AssetIssue.find({ reportedBy, assetId });
};

export {
  createResource,
  createAssetIssues,
  getAssetIssueById,
  getAllTags,
  getAllIssues,
  getTagsByTypeId,
  getTagsByAssetId,
  getTagById,
  updateTag,
  getAssetByUserId,
  createTag,
  getIssuesByUserId
};

import { buildContainsRegex } from "../../../constants/utils/regex";
import { Asset, IAsset } from "../../model/asset/asset";
import { AssetType, IAssetType } from "../../model/assetType/assetType";
import { User } from "../../model/user/user";
import { getAssetByUserId } from "../assetTag/assetTag";

const createAsset = async (assetData: IAsset): Promise<IAsset> => {
  const newAsset = new Asset(assetData);
  return await newAsset.save();
};

const createAssetType = async (assetData: IAssetType): Promise<IAssetType> => {
  const newAssetType = new AssetType(assetData);
  return await newAssetType.save();
};

const getAllAssetsTypes = async (): Promise<IAsset[]> => {
  return await AssetType.find();
};

const getAssetById = async (id: string): Promise<IAsset | null> => {
  return await Asset.findOne({ id, active: true });
};

const getAssetTypeById = async (id: string): Promise<IAsset | null> => {
  return await AssetType.findOne({ id });
};

const getAssetTypeByName = async (name: string): Promise<IAssetType | null> => {
  return await AssetType.findOne({ name });
};

const getAllAssets = async (
  skip?: number,
  limit?: number,
  userId?: string,
  typeId?: string,
  systemType?: string,
  warrantyFrom?: Date,
  warrantyTo?: Date,
  searchText?: string
): Promise<{ assets: IAsset[]; total: number }> => {
  let assetIds: string[] = [];
  if (userId) {
    const users = await User.find({ name: userId });
    if (!users) return { assets: [], total: 0 };

    const userIds = users.map((user) => user.id);
    const allTags = await Promise.all(userIds.map((id) => getAssetByUserId(id)));
    const tags = allTags.flat();

    assetIds = tags.map((tag) => tag.assetId);
    if (!assetIds.length) return { assets: [], total: 0 };
  }

  const query: any = { active: true };
  if (assetIds.length > 0) {
    query.id = { $in: assetIds };
  }
  if (typeId) {
    const assetType = await getAssetTypeByName(typeId);
    if (!assetType) return { assets: [], total: 0 };
    query.typeId = assetType.id;
  }
  if (systemType) {
    query.systemType = systemType;
  }
  if (warrantyFrom || warrantyTo) {
    query.warrantyDate = {};
    if (warrantyFrom) query.warrantyDate.$gte = warrantyFrom;
    if (warrantyTo) query.warrantyDate.$lte = warrantyTo;
  }
  if (searchText) {
    const regex = buildContainsRegex(searchText);
    query.$or = [{ modelName: regex }, { deviceName: regex }];
  }
  const total = await Asset.countDocuments(query);

  let findQuery = Asset.find(query);
  if (typeof skip === "number" && typeof limit === "number") {
    findQuery = findQuery.skip(skip).limit(limit);
  }

  const assets = await findQuery.sort({ createdAt: -1 });
  return { assets, total };
};

export const updateAsset = async (id: string, payload: Partial<IAsset>): Promise<IAsset | null> => {
  return await Asset.findOneAndUpdate(
    { id },
    { $set: payload },
    {
      new: true,
      runValidators: true
    }
  ).lean();
};
const update = async (asset: IAsset): Promise<IAsset> => {
  return await asset.save();
};

const getById = async (id: string): Promise<IAsset[] | null> => {
  return await Asset.findOne({ id, active: true });
};

export {
  createAsset,
  getAssetById,
  getAllAssets,
  update,
  createAssetType,
  getAllAssetsTypes,
  getAssetTypeById,
  getById
};

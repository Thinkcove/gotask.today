import { NOT_UTILIZED, OVERUTILIZED } from "../../../constants/assetConstant";
import { buildContainsRegex } from "../../../constants/utils/regex";
import { Asset, IAsset } from "../../model/asset/asset";
import { AssetTag } from "../../model/assetTag/assetTag";
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
  searchText?: string,
  assetUsage?: string | string[]
): Promise<{ assets: IAsset[]; total: number }> => {
  const usageType = Array.isArray(assetUsage) ? assetUsage[0] : assetUsage;

  const query: any = { active: true };
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
  const allAssets = await Asset.find(query);
  const allAssetIds = allAssets.map((asset) => asset.id);

  if (usageType === OVERUTILIZED) {
    const tags = await AssetTag.find({ assetId: { $in: allAssetIds }, active: true });

    const usageMap = new Map<string, number>();
    tags.forEach((tag) => {
      if (!tag.userId) return;
      usageMap.set(tag.userId, (usageMap.get(tag.userId) || 0) + 1);
    });

    let overusedUserIds = Array.from(usageMap.entries())
      .filter(([, count]) => count > 1)
      .map(([userId]) => userId);

    if (userId) {
      const assignedUsers = await User.find({ name: userId });
      const assignedUserIds = assignedUsers.map((u) => u.id);
      overusedUserIds = overusedUserIds.filter((id) => assignedUserIds.includes(id));
    }

    if (!overusedUserIds.length) return { assets: [], total: 0 };

    const overusedAssetIds = tags
      .filter((tag) => overusedUserIds.includes(tag.userId))
      .map((tag) => tag.assetId);

    const filteredAssets = allAssets.filter((asset) => overusedAssetIds.includes(asset.id));
    const total = filteredAssets.length;

    const paginatedAssets =
      typeof skip === "number" && typeof limit === "number"
        ? filteredAssets.slice(skip, skip + limit)
        : filteredAssets;

    return { assets: paginatedAssets, total };
  }

  if (usageType === NOT_UTILIZED) {
    if (userId) {
      return { assets: [], total: 0 };
    }
    const taggedAssetIds = await AssetTag.find({
      assetId: { $in: allAssetIds },
      active: true
    }).distinct("assetId");

    const unassignedAssets = allAssets.filter((asset) => !taggedAssetIds.includes(asset.id));
    const total = unassignedAssets.length;

    const paginatedAssets =
      typeof skip === "number" && typeof limit === "number"
        ? unassignedAssets.slice(skip, skip + limit)
        : unassignedAssets;

    return { assets: paginatedAssets, total };
  }

  if (userId) {
    const users = await User.find({ name: userId });
    if (!users.length) return { assets: [], total: 0 };

    const userIds = users.map((user) => user.id);
    const allTags = await Promise.all(userIds.map((id) => getAssetByUserId(id)));
    const tags = allTags.flat();

    const assetIds = tags.map((tag) => tag.assetId);
    if (!assetIds.length) return { assets: [], total: 0 };

    query.id = { $in: assetIds };
  }

  const total = await Asset.countDocuments(query);
  let findQuery = Asset.find(query).sort({ createdAt: -1 });

  if (typeof skip === "number" && typeof limit === "number") {
    findQuery = findQuery.skip(skip).limit(limit);
  }

  const assets = await findQuery;
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

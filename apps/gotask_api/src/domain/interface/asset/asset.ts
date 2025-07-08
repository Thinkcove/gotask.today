import { Asset, IAsset } from "../../model/asset/asset";
import { AssetTag, IAssetTag } from "../../model/assetTag/assetTag";
import { AssetType, IAssetType } from "../../model/assetType/assetType";
import { IUser, User } from "../../model/user/user";

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

const getAllAssets = async (
  skip?: number,
  limit?: number,
  userId?: string,
  typeId?: string,
  systemType?: string,
  warrantyFrom?: Date,
  warrantyTo?: Date
): Promise<IAsset[]> => {
  let assetIds: string[] = [];
  console.log("typeId", typeId);
  if (userId) {
    const userBasedAssets = await AssetTag.find({ userId });
    assetIds = userBasedAssets.map((tag) => tag.assetId.toString());

    if (assetIds.length === 0) {
      return [];
    }
  }

  // Build base query
  let query: any = { active: true };
  if (assetIds.length > 0) {
    query.id = { $in: assetIds };
  }

  if (typeId) {
    query.typeId = typeId;
  }

  if (systemType) {
    query.systemType = systemType;
  }

  if (warrantyFrom || warrantyTo) {
    query.warrantyDate = {};
    if (warrantyFrom) {
      query.warrantyDate.$gte = warrantyFrom;
    }
    if (warrantyTo) {
      query.warrantyDate.$lte = warrantyTo;
    }
  }

  let findQuery = Asset.find(query);

  if (typeof skip === "number" && typeof limit === "number") {
    findQuery = findQuery.skip(skip).limit(limit);
  }

  return await findQuery.sort({ createdAt: -1 });
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

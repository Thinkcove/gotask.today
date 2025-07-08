import { Asset, IAsset } from "../../model/asset/asset";
import { AssetType, IAssetType } from "../../model/assetType/assetType";

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
  return await Asset.findOne({ id });
};

const getAssetTypeById = async (id: string): Promise<IAsset | null> => {
  return await AssetType.findOne({ id });
};

// const getAllAssets = async (
//   query: Record<string, any> = {},
//   skip = 1,
//   limit = 25
// ): Promise<IAsset[]> => {
//   return await Asset.find({ active: true, ...query })
//     .skip(skip)
//     .limit(limit)
//     .sort({ createdAt: -1 });
// };

const getAllAssets = async (
  query: Record<string, any> = {},
  skip?: number,
  limit?: number
): Promise<IAsset[]> => {
  let findQuery = Asset.find({ active: true, ...query });

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

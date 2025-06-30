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

const getAllAssets = async (
  sortType: string = "desc",
  sortVar: string = "createdAt"
): Promise<IAsset[]> => {
  const sortOrder = sortType === "asc" ? 1 : -1;

  const directSortableFields = [
    "createdAt",
    "updatedAt",
    "deviceName",
    "serialNumber",
    "modelName",
    "os",
    "ram",
    "processor",
    "active"
  ];

  if (directSortableFields.includes(sortVar)) {
    const sortObj: any = {};
    sortObj[sortVar] = sortOrder;
    return await Asset.find().sort(sortObj);
  }

  return await Asset.find().sort({ createdAt: -1 });
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
  return await Asset.findOne({ id });
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

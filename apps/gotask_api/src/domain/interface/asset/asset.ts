import { Asset, IAsset } from "../../model/asset/asset";

const createAsset = async (assetData: IAsset): Promise<IAsset> => {
  const newAsset = new Asset(assetData);
  return await newAsset.save();
};

const getAssetById = async (id: string): Promise<IAsset | null> => {
  return await Asset.findOne({ id });
};

const getAllAssets = async (): Promise<IAsset[]> => {
  return await Asset.find();
};

const update = async (asset: IAsset): Promise<IAsset> => {
  return await asset.save();
};

export { createAsset, getAssetById, getAllAssets, update };

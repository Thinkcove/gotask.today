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

const getAllAssets = async (): Promise<IAsset[]> => {
  return await Asset.find();
};

const update = async (asset: IAsset): Promise<IAsset> => {
  return await asset.save();
};

export { createAsset, getAssetById, getAllAssets, update, createAssetType, getAllAssetsTypes };

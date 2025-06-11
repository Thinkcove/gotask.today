import { AssetTag, IAssetTag } from "../../model/assetTag/assetTag";

const createResource = async (resourceData: IAssetTag): Promise<IAssetTag> => {
  const newResource = new AssetTag(resourceData);
  return await newResource.save();
};

export { createResource };

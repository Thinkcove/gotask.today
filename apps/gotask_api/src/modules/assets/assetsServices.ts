import AssetMessages from "../../constants/apiMessages/assetMessage";
import UserMessages from "../../constants/apiMessages/userMessage";
import {
  createAsset,
  getAssetById,
  getAllAssets,
  update,
  createAssetType,
  getAllAssetsTypes,
  getAssetTypeById
} from "../../domain/interface/asset/asset";
import { findUserByEmail } from "../../domain/interface/user/userInterface";
import { IAsset } from "../../domain/model/asset/asset";
import { IAssetTag } from "../../domain/model/assetTag/assetTag";

class assetService {
  // CREATE ASSET
  createAsset = async (payload: any, user: any): Promise<any> => {
    const userInfo = await findUserByEmail(user.user_id);
    if (!userInfo) {
      return {
        success: false,
        error: UserMessages.FETCH.NOT_FOUND
      };
    }

    if (!payload) {
      return {
        success: false,
        error: AssetMessages.CREATE.INVALID_PAYLOAD
      };
    }
    try {
      const asset = await createAsset({
        ...payload
      });
      return {
        success: true,
        data: asset
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  createAssetType = async (payload: any, user: any): Promise<any> => {
    const userInfo = await findUserByEmail(user.user_id);
    if (!userInfo) {
      return {
        success: false,
        error: UserMessages.FETCH.NOT_FOUND
      };
    }

    if (!payload) {
      return {
        success: false,
        error: AssetMessages.CREATE.INVALID_PAYLOAD
      };
    }
    try {
      const asset = await createAssetType({
        ...payload
      });
      return {
        success: true,
        data: asset
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  getAllAssets = async (): Promise<any> => {
    try {
      const assets = await getAllAssets();
      const tagsData = await Promise.all(
        assets.map(async (tagDoc: IAsset) => {
          const tag = tagDoc.toObject();
          const [asset] = await Promise.all([getAssetTypeById(tag.typeId)]);

          return {
            ...tag,
            assetType: asset || null
          };
        })
      );
      return {
        success: true,
        data: tagsData
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || AssetMessages.FETCH.NOT_FOUND
      };
    }
  };

  getAssetById = async (id: string, user: any): Promise<any> => {
    const userInfo = await findUserByEmail(user.user_id);
    if (!userInfo) {
      return {
        success: false,
        error: UserMessages.FETCH.NOT_FOUND
      };
    }
    try {
      const data = await getAssetById(id);
      return {
        data,
        success: true
      };
    } catch {
      return {
        success: false,
        error: AssetMessages.FETCH.FAILED_TO_GET_ASSET
      };
    }
  };

  getAllAssetsTypes = async (): Promise<any> => {
    try {
      const assets = await getAllAssetsTypes();
      return {
        success: true,
        data: assets
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || AssetMessages.FETCH.ASSET_TYPE_NOT_FOUND
      };
    }
  };

  deleteAsset = async (id: string): Promise<{ success: boolean; message: string }> => {
    const asset = await getAssetById(id);

    if (!asset) {
      return {
        success: false,
        message: AssetMessages.FETCH.NOT_FOUND
      };
    }

    asset.active = false;
    await update(asset);

    return {
      success: true,
      message: AssetMessages.DELETE.SUCCESS
    };
  };
}

export default new assetService();

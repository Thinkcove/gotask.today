import {
  createAsset,
  getAssetById,
  getAllAssets,
  update,
  createAssetType,
  getAllAssetsTypes
} from "../../domain/interface/asset/asset";
import { findUserByEmail } from "../../domain/interface/user/userInterface";

class assetService {
  // CREATE ASSET
  createAsset = async (payload: any, user: any): Promise<any> => {
    const userInfo = await findUserByEmail(user.user_id);
    if (!userInfo) {
      return {
        success: false,
        error: "User not found"
      };
    }

    if (!payload) {
      return {
        success: false,
        error: "Invalid Payload"
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
        error: "User not found"
      };
    }

    if (!payload) {
      return {
        success: false,
        error: "Invalid Payload"
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
      return {
        success: true,
        data: assets
      };
    } catch (ex) {
      return {
        success: false,
        error: "Assets not found"
      };
    }
  };

  getAssetById = async (id: string, user: any): Promise<any> => {
    const userInfo = await findUserByEmail(user.user_id);
    if (!userInfo) {
      return {
        success: false,
        error: "User not found"
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
        error: "Failed to get asset"
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
    } catch (ex) {
      return {
        success: false,
        error: "Assets types not found"
      };
    }
  };

  deleteAsset = async (id: string): Promise<{ success: boolean; message: string }> => {
    const asset = await getAssetById(id);

    if (!asset) {
      return {
        success: false,
        message: "Asset not found"
      };
    }

    asset.active = false;
    await update(asset);

    return {
      success: true,
      message: "Asset deleted successfully"
    };
  };
}

export default new assetService();

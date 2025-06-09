import {
  createAsset,
  getAssetById,
  getAllAssets,
  update
} from "../../domain/interface/asset/asset";

class assetService {
  // CREATE ASSET
  createAsset = async (payload: any): Promise<any> => {
    // const userInfo = await createAsset(user.email);
    // if (!userInfo) {
    //   return {
    //     success: false,
    //     error: "User not found"
    //   };
    // }

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

  getAssetById = async (id: string): Promise<any> => {
    try {
      const data = await getAssetById(id);
      return {
        data,
        success: true
      };
    } catch {
      return {
        success: false,
        error: "INVALID_EXPENSE_FORM_FIELD"
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
      message: "Asset deleted (soft delete) successfully"
    };
  };
}

export default new assetService();

import AssetMessages from "../../constants/apiMessages/assetMessage";
import UserMessages from "../../constants/apiMessages/userMessage";
import {
  createAsset,
  getAssetById,
  getAllAssets,
  update,
  createAssetType,
  getAllAssetsTypes,
  getAssetTypeById,
  updateAsset
} from "../../domain/interface/asset/asset";
import {
  createResource,
  getAssetByUserId,
  getTagsByAssetId,
  getTagsByTypeId,
  updateTag
} from "../../domain/interface/assetTag/assetTag";
import { findUser, findUserByEmail } from "../../domain/interface/user/userInterface";
import { IAsset } from "../../domain/model/asset/asset";

class assetService {
  createOrUpdateAsset = async (payload: any, user: any): Promise<any> => {
    if (!payload) {
      return {
        success: false,
        error: AssetMessages.CREATE.INVALID_PAYLOAD
      };
    }

    try {
      const userInfo = await findUserByEmail(user.user_id);
      if (!userInfo) {
        return {
          success: false,
          error: UserMessages.FETCH.NOT_FOUND
        };
      }

      // Update tag if both tag and userId are provided
      if (payload.userId && payload.tag) {
        await updateTag(payload.tag, { userId: payload.userId });
      }

      let result;

      // Update existing asset
      if (payload.id) {
        const existingAsset = await getAssetById(payload.id);
        if (existingAsset) {
          result = await updateAsset(payload.id, { ...payload });
          return { success: true, data: result };
        }
      }

      // Create new asset
      result = await createAsset({ ...payload });

      // Create resource if userId and asset ID exist
      if (payload.userId && result?.id) {
        await createResource(payload, result.id);
      }

      return { success: true, data: result };
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
          const [asset, tagData] = await Promise.all([
            getAssetTypeById(tag.typeId),
            getTagsByTypeId(tag.id)
          ]);

          const tagDataWithUsers = await Promise.all(
            (tagData || []).map(async (item: any) => {
              const tagItem = item.toObject ? item.toObject() : item;
              let user = null;

              if (tagItem.userId) {
                user = await findUser(item.userId);
              }

              return {
                ...tagItem,
                user: user || null
              };
            })
          );

          return {
            ...tag,
            assetType: asset || null,
            tagData: tagDataWithUsers || null
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
      const data = await getAssetById(id); // use actual DB function
      if (!data) {
        return {
          success: false,
          error: AssetMessages.FETCH.NOT_FOUND
        };
      }

      const tags = await getTagsByAssetId(data.id);
      return {
        data: {
          ...data.toObject(),
          tags
        },
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

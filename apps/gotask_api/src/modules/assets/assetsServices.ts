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
import { createAssetHistory, getAssetHistoryById } from "../../domain/interface/asset/assetHistory";
import {
  createResource,
  createTag,
  getTagsByAssetId,
  getTagsByTypeId,
  updateTag
} from "../../domain/interface/assetTag/assetTag";
import { findUser, findUserByEmail } from "../../domain/interface/user/userInterface";
import { IAsset } from "../../domain/model/asset/asset";
import { generateAssetHistoryEntry } from "./utils/assetHistory";

class assetService {
  createOrUpdateAsset = async (payload: any, user: any): Promise<any> => {
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
      if (payload.userId && payload.tag) {
        await updateTag(payload.tag, {
          userId: payload.userId,
          previouslyUsedBy: payload?.previouslyUsedBy || ""
        });
      } else if (payload.userId && payload.id && payload.tag === "") {
        const assetsTag = {
          ...payload,
          assetId: payload.id
        };
        await createTag(assetsTag);
      }
      let result;
      if (payload.id) {
        const existingAsset = await getAssetById(payload.id);
        if (existingAsset) {
          result = await updateAsset(payload.id, {
            ...payload
          });

          // Save history if any field changed
          const historyLogs = await generateAssetHistoryEntry(existingAsset, payload);
          const filteredLogs = historyLogs.filter((entry) => !entry.toLowerCase().includes("tag"));
          if (filteredLogs.length > 0) {
            await createAssetHistory({
              assetId: payload.id,
              userId: userInfo.id,
              formatted_history: filteredLogs.join(" | "),
              created_by: userInfo.name
            });
          }
          return { success: true, data: result };
        }
      }

      result = await createAsset({
        ...payload
      });

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
      const assetType = await getAssetTypeById(data.typeId);

      const assetHistory = await getAssetHistoryById(data.id);

      const tags = await getTagsByAssetId(data.id);
      return {
        data: {
          ...data.toObject(),
          tags,
          assetHistory,
          type: assetType?.name
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

  getUserByAssetId = async (id: string, user: any): Promise<any> => {
    const userInfo = await findUserByEmail(user.user_id);
    if (!userInfo) {
      return {
        success: false,
        error: UserMessages.FETCH.NOT_FOUND
      };
    }
    try {
      const data = await getTagsByAssetId(id);
      if (!data) {
        return {
          success: false,
          error: AssetMessages.FETCH.NOT_FOUND
        };
      }

      const users = await findUser(data.userId);
      return {
        data: users,
        success: true
      };
    } catch {
      return {
        success: false,
        error: AssetMessages.FETCH.FAILED_TO_GET_ASSET
      };
    }
  };
}

export default new assetService();

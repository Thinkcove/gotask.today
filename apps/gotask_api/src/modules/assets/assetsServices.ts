import AssetMessages from "../../constants/apiMessages/assetMessage";
import UserMessages from "../../constants/apiMessages/userMessage";
import { ASC, CREATE_AT, DESC } from "../../constants/assetConstant";
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
  getAssetByUserId,
  getIssuesByUserId,
  getTagsByAssetId,
  getTagsByTypeId,
  updateTag
} from "../../domain/interface/assetTag/assetTag";
import { findUser, findUserByEmail } from "../../domain/interface/user/userInterface";
import { Asset } from "../../domain/model/asset/asset";
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

  sortData = (data: any[], sortVar: string, sortOrder: string = ASC) => {
    return [...data].sort((a, b) => {
      const getSortValue = (item: any) => {
        if (typeof item[sortVar] === "object" && item[sortVar]?.name) {
          return item[sortVar].name;
        }

        if (item[sortVar] !== undefined) {
          return item[sortVar];
        }

        const match = item.tagData?.find((tag: any) => {
          if (typeof tag[sortVar] === "object" && tag[sortVar]?.name) {
            return true;
          }
          return tag[sortVar] !== undefined;
        });

        if (match) {
          const value = match[sortVar];
          return typeof value === "object" && value?.name ? value.name : value;
        }

        return "";
      };

      const aVal = getSortValue(a);
      const bVal = getSortValue(b);

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });
  };

  buildAssetFilterQuery = (filters: any = {}) => {
    const query: any = { active: true };

    if (filters.assetType) {
      query["typeId"] = filters.assetType;
    }

    if (filters.modelName) {
      query["modelName"] = filters.modelName;
    }

    if (filters.assignedTo) {
      query["assignedTo"] = filters.assignedTo;
    }

    if (filters.assetType) {
      query["assetType"] = filters.assetType;
    }

    if (filters.assetAllocationFilter) {
      query["assetAllocationFilter"] = filters.assetAllocationFilter;
    }

    if (filters.systemType) {
      query["systemType"] = filters.systemType;
    }

    if (filters.warrantyFrom || filters.warrantyTo) {
      query["warrantyDate"] = {};
      if (filters.warrantyFrom) {
        query["warrantyDate"]["$gte"] = new Date(filters.warrantyFrom);
      }
      if (filters.warrantyTo) {
        query["warrantyDate"]["$lte"] = new Date(filters.warrantyTo);
      }
    }

    return query;
  };

  getAllAssets = async ({
    sortType = DESC,
    sortVar = CREATE_AT,
    filters = {},
    page,
    limit
  }: {
    sortType?: string;
    sortVar?: string;
    filters?: Record<string, any>;
    page?: number;
    limit?: number;
  }) => {
    try {
      const query = this.buildAssetFilterQuery(filters);
      // const total = await Asset.countDocuments(query);
      // const skip = (page - 1) * limit;
      // const assets = await getAllAssets(query, skip, limit);
      let assets = [];
      const total = await Asset.countDocuments(query);

      if (typeof page === "number" && typeof limit === "number") {
        const skip = (page - 1) * limit;
        assets = await getAllAssets(query, skip, limit);
      } else {
        assets = await getAllAssets(query); // no pagination
      }

      const tagsData = await Promise.all(
        assets.map(async (assetDoc) => {
          const asset = assetDoc.toObject();
          const [typeData, tagDataRaw] = await Promise.all([
            getAssetTypeById(asset.typeId),
            getTagsByTypeId(asset.id)
          ]);

          const tagDataWithUsers = await Promise.all(
            tagDataRaw.map(async (tag) => ({
              ...tag.toObject(),
              user: tag.userId ? await findUser(tag.userId) : null
            }))
          );

          const issuesList = (
            await Promise.all(
              tagDataRaw
                .filter((tag) => tag.userId && tag.assetId)
                .map((tag) => getIssuesByUserId(tag.userId, tag.assetId))
            )
          ).flat();

          const assetByUsers = (
            await Promise.all(tagDataRaw.map((tag) => getAssetByUserId(tag.userId)))
          ).flat();

          const accessCards = await Promise.all(assetByUsers.map((a) => getAssetById(a.assetId)));
          const filteredCount = accessCards.filter(
            (card) => card && !card.accessCardNo?.trim()
          ).length;

          return {
            ...asset,
            assetType: typeData || null,
            tagData: tagDataWithUsers || null,
            issuesCount: issuesList.length || 0,
            userAssetCount: filteredCount || 0,
            userAsset: assetByUsers || null
          };
        })
      );
      const sortedData = this.sortData(tagsData, sortVar, sortType);
      return { success: true, data: sortedData, total };
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

      let getIssuesByUser = null;
      if (tags?.userId && tags?.assetId) {
        getIssuesByUser = await getIssuesByUserId(tags?.userId, tags?.assetId);
      }
      let userData = null;
      if (tags) {
        userData = await findUser(tags.userId);
      }
      return {
        data: {
          ...data.toObject(),
          tags,
          assetHistory,
          type: assetType?.name,
          assignedTo: userData?.name,
          issues: getIssuesByUser
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

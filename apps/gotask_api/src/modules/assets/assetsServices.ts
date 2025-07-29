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
import { IAssetsSchema } from "../../domain/model/asset/interface/assetsSchema";
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

  sortData = (data: any[], sortVar: string, sortOrder: string = "asc") => {
    return [...data].sort((a, b) => {
      const getSortValue = (item: any): string => {
        let val = item[sortVar];

        if (typeof val === "object" && val?.name) val = val.name;
        if ((!val || val === "") && sortVar === "deviceName") {
          val = item["accessCardNo"];
          if (typeof val === "object" && val?.name) val = val.name;
        }

        const tagMatch = item.tagData?.find(
          (tag: any) =>
            tag[sortVar] !== undefined ||
            (sortVar === "deviceName" && tag["accessCardNo"] !== undefined)
        );

        if ((!val || val === "") && tagMatch) {
          val = sortVar === "deviceName" ? tagMatch["accessCardNo"] : tagMatch[sortVar];
          if (typeof val === "object" && val?.name) val = val.name;
        }

        return String(val || "").trim();
      };

      const isAlphanumeric = (val: string) => /[a-zA-Z]/.test(val) && /\d/.test(val);
      const isTextOnly = (val: string) => /^[a-zA-Z\s]+$/.test(val);

      const aVal = getSortValue(a);
      const bVal = getSortValue(b);

      // Step 1: Compare alphabetically A–Z
      const mainCompare = aVal.localeCompare(bVal, undefined, {
        numeric: true,
        sensitivity: "base"
      });

      if (mainCompare !== 0) return sortOrder === "asc" ? mainCompare : -mainCompare;

      // Step 2: If alphabetically equal, put alphanumeric before pure text
      const aIsAlphaNum = isAlphanumeric(aVal);
      const bIsAlphaNum = isAlphanumeric(bVal);
      const aIsText = isTextOnly(aVal);
      const bIsText = isTextOnly(bVal);

      if (aIsAlphaNum && bIsText) return -1;
      if (aIsText && bIsAlphaNum) return 1;

      return 0;
    });
  };

  getAllAssets = async ({
    sortType = DESC,
    sortVar = CREATE_AT,
    page,
    limit,
    userId,
    typeId,
    systemType,
    warrantyFrom,
    warrantyTo,
    searchText,
    assetUsage
  }: {
    sortType?: string;
    sortVar?: string;
    page?: number;
    limit?: number;
    userId?: string;
    typeId?: string;
    systemType?: string;
    warrantyFrom?: Date;
    warrantyTo?: Date;
    searchText?: string;
    assetUsage?: string;
  }) => {
    try {
      let assets: IAssetsSchema[] = [];
      let total = 0;

      if (typeof page === "number" && typeof limit === "number") {
        const skip = (page - 1) * limit;
        const result = await getAllAssets(
          skip,
          limit,
          userId,
          typeId,
          systemType,
          warrantyFrom,
          warrantyTo,
          searchText,
          assetUsage
        );
        assets = result.assets;
        total = result.total;
      } else {
        const result = await getAllAssets();
        assets = result.assets;
        total = result.total;
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

          return {
            ...asset,
            assetType: typeData || null,
            tagData: tagDataWithUsers || null,
            issuesCount: issuesList.length || 0,
            userAsset: assetByUsers || null
          };
        })
      );
      const sortedData = this.sortData(tagsData, sortVar, sortType);
      return {
        success: true,
        data: sortedData,
        total,
        filtered: sortedData.length
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

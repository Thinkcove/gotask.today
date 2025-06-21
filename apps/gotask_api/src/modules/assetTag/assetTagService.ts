import AssetMessages from "../../constants/apiMessages/assetMessage";
import UserMessages from "../../constants/apiMessages/userMessage";
import { getAssetById } from "../../domain/interface/asset/asset";
import {
  createIssuesHistory,
  getIssuesHistoryById
} from "../../domain/interface/asset/assetHistory";
import {
  createAssetIssues,
  createResource,
  getAllIssues,
  getAllTags,
  getAssetIssueById,
  getTagById,
  updateAssetIssue,
  updateTag
} from "../../domain/interface/assetTag/assetTag";
import { findUser, findUserByEmail } from "../../domain/interface/user/userInterface";
import { IAssetTag } from "../../domain/model/assetTag/assetTag";

class resourceService {
  createOrUpdateAssetTag = async (payload: any, user: any): Promise<any> => {
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
      let result;
      if (payload.id) {
        const existingTag = await getTagById(payload.id);
        if (existingTag) {
          result = await updateTag(payload.id, {
            ...payload,
            updatedBy: userInfo.user_id,
            updatedAt: new Date()
          });
          return { success: true, data: result };
        }
      }

      result = await createResource({
        ...payload,
        createdBy: userInfo.user_id,
        createdAt: new Date()
      });

      return { success: true, data: result };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  getAllTags = async (): Promise<any> => {
    try {
      const assets = await getAllTags();

      const tagsData = await Promise.all(
        assets.map(async (tagDoc: IAssetTag) => {
          const tag = tagDoc.toObject();
          const [asset, previouslyUsedByUser, userDetails] = await Promise.all([
            getAssetById(tag.assetId),
            findUser(tag.previouslyUsedBy),
            findUser(tag.userId)
          ]);

          return {
            ...tag,
            assetDetails: asset || null,
            previouslyUsedByUser: previouslyUsedByUser || null,
            userDetails: userDetails || null
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
        error: error.message || AssetMessages.FETCH.ASSET_TYPE_NOT_FOUND
      };
    }
  };

  createOrUpdateAssetIssues = async (payload: any, user: any): Promise<any> => {
    const userInfo = await findUserByEmail(user.user_id);
    if (!userInfo) {
      return { success: false, error: UserMessages.FETCH.NOT_FOUND };
    }
    if (!payload) {
      return { success: false, error: AssetMessages.CREATE.INVALID_PAYLOAD };
    }
    try {
      let result;
      if (payload.id) {
        const existingIssue = await getAssetIssueById(payload.id);
        if (existingIssue) {
          result = await updateAssetIssue(payload.id, {
            ...payload,
            updatedBy: userInfo.user_id,
            updatedAt: new Date()
          });
          await createIssuesHistory({
            issuesId: payload.id,
            userId: userInfo.id,
            formatted_history: payload.status
          });
          return { success: true, data: result };
        }
      }
      result = await createAssetIssues({
        ...payload
      });

      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  getAllIssues = async (): Promise<any> => {
    try {
      const assetsIssues = await getAllIssues();
      const tagsData = await Promise.all(
        assetsIssues.map(async (tagDoc: IAssetTag) => {
          const tag = tagDoc.toObject();
          const [asset, assignedTo, reportedBy] = await Promise.all([
            getAssetById(tag.assetId),
            findUser(tag.assignedTo),
            findUser(tag.reportedBy)
          ]);

          return {
            ...tag,
            assetDetails: asset || null,
            assigned: assignedTo || null,
            reportedDetails: reportedBy || null
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
        error: error.message || AssetMessages.FETCH.ASSET_TYPE_NOT_FOUND
      };
    }
  };

  getTagById = async (id: string, user: any): Promise<any> => {
    const userInfo = await findUserByEmail(user.user_id);
    if (!userInfo) {
      return {
        success: false,
        error: UserMessages.FETCH.NOT_FOUND
      };
    }
    try {
      const data = await getTagById(id);
      if (!data) {
        return {
          success: false,
          error: AssetMessages.FETCH.NOT_FOUND
        };
      }
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

  getIssuesById = async (id: string, user: any): Promise<any> => {
    const userInfo = await findUserByEmail(user.user_id);
    if (!userInfo) {
      return {
        success: false,
        error: UserMessages.FETCH.NOT_FOUND
      };
    }
    try {
      const data = await getAssetIssueById(id);
      if (!data) {
        return {
          success: false,
          error: AssetMessages.FETCH.NOT_FOUND
        };
      }
      const issuesHistory = await getIssuesHistoryById(data.id);
      const enrichedHistory = await Promise.all(
        issuesHistory.map(async (historyItem: any) => {
          const userDetail = await findUser(historyItem.userId);
          return {
            ...historyItem.toObject(),
            userData: userDetail
          };
        })
      );
      return {
        data: {
          ...data.toObject(),
          issuesHistory: enrichedHistory
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
}

export default new resourceService();

import AssetMessages from "../../constants/apiMessages/assetMessage";
import UserMessages from "../../constants/apiMessages/userMessage";
import {
  createAssetIssues,
  createResource,
  getAllTags,
  getAssetIssueById,
  updateAssetIssue
} from "../../domain/interface/assetTag/assetTag";
import { findUserByEmail } from "../../domain/interface/user/userInterface";

class resourceService {
  // CREATE ASSET
  createAssetTag = async (payload: any, user: any): Promise<any> => {
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
      const asset = await createResource({
        ...payload,
        userId: userInfo.user_id
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

  getAllTags = async (): Promise<any> => {
    try {
      const assets = await getAllTags();
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
          return { success: true, data: result };
        }
      }
      result = await createAssetIssues({
        ...payload,
        reportedBy: userInfo.user_id
      });

      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };
}

export default new resourceService();

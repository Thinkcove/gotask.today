import { createResource } from "../../domain/interface/assetTag/assetTag";
import { findUserByEmail } from "../../domain/interface/user/userInterface";

class resourceService {
  // CREATE ASSET
  createAssetTag = async (payload: any, user: any): Promise<any> => {
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
}

export default new resourceService();

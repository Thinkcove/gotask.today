import { createResource } from "../../domain/interface/resource/resource";

class resourceService {
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
      const asset = await createResource({
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
}

export default new resourceService();

import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import {
  createLeaveService,
  getAllLeavesService,
  getLeaveByIdService,
  updateLeaveService,
  deleteLeaveService,
  getLeavesWithFiltersService
} from "./leaveServices";

class LeaveController extends BaseController {
  async createLeave(requestHelper: RequestHelper, handler: any) {
    try {
      const leaveData = requestHelper.getPayload();
      const user = requestHelper.getUser();

      if (!user || !user.id) {
        throw new Error("user ID not found");
      }

      const leaveDataWithUserId = {
        ...leaveData,
        user_id: user.id
      };

      const result = await createLeaveService(leaveDataWithUserId);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getAllLeaves(requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAllLeavesService();
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getLeavesWithFilters(requestHelper: RequestHelper, handler: any) {
    try {
      const user = requestHelper.getUser();

      if (!user || !user.id) {
        throw new Error("user ID not found");
      }

      const filters = requestHelper.getPayload();

      const result = await getLeavesWithFiltersService(filters);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getLeaveById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = requestHelper.getUser();

      if (!user || !user.id) {
        throw new Error("user ID not found");
      }

      const result = await getLeaveByIdService(id);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async updateLeave(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updateData = requestHelper.getPayload();
      const user = requestHelper.getUser();

      if (!user || !user.id) {
        throw new Error("user ID not found");
      }

      const existingLeave = await getLeaveByIdService(id);
      if (!existingLeave.success || !existingLeave.data) {
        return this.sendResponse(handler, {
          success: false,
          message: "Leave request not found"
        });
      }

      const { ...updateDataWithoutUserId } = updateData;

      const result = await updateLeaveService(id, updateDataWithoutUserId);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async deleteLeave(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = requestHelper.getUser();

      if (!user || !user.id) {
        throw new Error("user ID not found");
      }

      const existingLeave = await getLeaveByIdService(id);
      if (!existingLeave.success || !existingLeave.data) {
        return this.sendResponse(handler, {
          success: false,
          message: "Leave request not found"
        });
      }

      const result = await deleteLeaveService(id);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default LeaveController;

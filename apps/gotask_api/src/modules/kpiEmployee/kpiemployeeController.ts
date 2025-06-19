import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { IKpiAssignment } from "../../domain/model/kpiemployee/kpiemloyeeModel";
import { KpiAssignmentMessages } from "../../constants/apiMessages/kpiemployeeMessages";
import {
  createKpiAssignment,
  deleteKpiAssignmentById,
  getAllKpiAssignments,
  getKpiAssignmentById,
  updateKpiAssignment
} from "./kpiemployeeService";
import { getKpiAssignmentByIdFromDb } from "../../domain/interface/kpiemployee/kpiemployeeInterface";

class KpiAssignmentController extends BaseController {
  // Create KPI Assignment
  async createKpiAssignment(
    requestHelper: RequestHelper,
    handler: any,
    restrictedFields: string[] = []
  ) {
    try {
      const assignmentData = requestHelper.getPayload() as Partial<IKpiAssignment>;

      // Cast to any to allow dynamic delete without TS error
      const assignmentDataAny = assignmentData as any;

      // Remove restricted fields from assignmentData
      restrictedFields.forEach((field) => {
        if (field in assignmentDataAny) {
          delete assignmentDataAny[field];
        }
      });

      // Validate required fields
      if (
        !assignmentData.user_id ||
        !assignmentData.measurementCriteria ||
        !assignmentData.frequency ||
        !assignmentData.weightage ||
        !assignmentData.assigned_by ||
        (!assignmentData.template_id &&
          (!assignmentData.kpiTitle || !assignmentData.kpiDescription))
      ) {
        return this.replyError(new Error(KpiAssignmentMessages.CREATE.REQUIRED));
      }

      // Extract authUserId from payload (must match User.id)
      const authUserId = assignmentDataAny.authUserId || assignmentData.assigned_by;
      if (!authUserId) {
        return this.replyError(new Error("authUserId or assigned_by is required in payload"));
      }

      const newAssignment = await createKpiAssignment(assignmentData, authUserId, restrictedFields);
      if (!newAssignment.success) {
        console.error(`createKpiAssignment failed: ${newAssignment.message}`);
        return this.replyError(
          new Error(newAssignment.message || KpiAssignmentMessages.CREATE.FAILED)
        );
      }

      return this.sendResponse(handler, newAssignment.data);
    } catch (error) {
      console.error("Error in createKpiAssignment controller:", error);
      return this.replyError(error);
    }
  }

  // Get All KPI Assignments for a User
  async getAllKpiAssignments(requestHelper: RequestHelper, handler: any) {
    try {
      const user_id_param = requestHelper.getQueryParam("user_id");
      const payload = requestHelper.getPayload() as any;

      if (!user_id_param) {
        return this.replyError(new Error(KpiAssignmentMessages.FETCH.REQUIRED));
      }

      // Extract authUserId from payload (must match User.id)
      const authUserId = payload.authUserId || "system";
      if (!authUserId) {
        return this.replyError(new Error("authUserId is required in payload"));
      }

      const result = await getAllKpiAssignments(user_id_param, authUserId);
      if (!result.success) {
        console.error(`getAllKpiAssignments failed: ${result.message}`);
        return this.replyError(new Error(result.message || KpiAssignmentMessages.FETCH.FAILED_ALL));
      }
      return this.sendResponse(handler, result.data);
    } catch (error) {
      console.error("Error in getAllKpiAssignments controller:", error);
      return this.replyError(error);
    }
  }

  // Get KPI Assignment by assignment_id
  async getKpiAssignmentById(requestHelper: RequestHelper, handler: any) {
    try {
      const assignment_id = requestHelper.getParam("assignment_id");
      const payload = requestHelper.getPayload() as any;

      // Extract authUserId from payload (must match User.id)
      const authUserId = payload.authUserId || "system";
      if (!authUserId) {
        return this.replyError(new Error("authUserId is required in payload"));
      }

      const result = await getKpiAssignmentById(assignment_id, authUserId);
      if (!result.success) {
        console.error(`getKpiAssignmentById failed: ${result.message}`);
        return this.replyError(
          new Error(result.message || KpiAssignmentMessages.FETCH.FAILED_BY_ID)
        );
      }
      return this.sendResponse(handler, result.data);
    } catch (error) {
      console.error("Error in getKpiAssignmentById controller:", error);
      return this.replyError(error);
    }
  }

  // Update KPI Assignment
  async updateKpiAssignment(
    requestHelper: RequestHelper,
    handler: any,
    restrictedFields: string[] = []
  ) {
    try {
      const assignment_id = requestHelper.getParam("assignment_id");
      const payload = requestHelper.getPayload() as Partial<IKpiAssignment>;

      // Cast to any to allow dynamic delete without TS error
      const payloadAny = payload as any;

      // Remove restricted fields from the payload
      restrictedFields.forEach((field) => {
        if (field in payloadAny) {
          delete payloadAny[field];
        }
      });

      // Extract authUserId from payload (must match User.id)
      const authUserId = payloadAny.authUserId || "system";
      if (!authUserId) {
        return this.replyError(new Error("authUserId is required in payload"));
      }

      // Fetch current assignment for validation
      const currentAssignment = await getKpiAssignmentByIdFromDb(assignment_id);
      if (!currentAssignment) {
        return this.replyError(new Error(KpiAssignmentMessages.UPDATE.NOT_FOUND));
      }

      const result = await updateKpiAssignment(
        assignment_id,
        payload,
        authUserId,
        restrictedFields
      );
      if (!result.success) {
        console.error(`updateKpiAssignment failed: ${result.message}`);
        return this.replyError(new Error(result.message || KpiAssignmentMessages.UPDATE.FAILED));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      console.error("Error in updateKpiAssignment controller:", error);
      return this.replyError(error);
    }
  }

  // Delete KPI Assignment
  async deleteKpiAssignment(requestHelper: RequestHelper, handler: any) {
    try {
      const assignment_id = requestHelper.getParam("assignment_id");
      const payload = requestHelper.getPayload() as any;

      // Extract authUserId from payload (must match User.id)
      const authUserId = payload.authUserId || "system";
      if (!authUserId) {
        return this.replyError(new Error("authUserId is required in payload"));
      }

      const result = await deleteKpiAssignmentById(assignment_id, authUserId);
      if (!result.success) {
        console.error(`deleteKpiAssignment failed: ${result.message}`);
        return this.replyError(new Error(result.message || KpiAssignmentMessages.DELETE.FAILED));
      }
      return this.sendResponse(handler, { message: KpiAssignmentMessages.DELETE.SUCCESS });
    } catch (error) {
      console.error("Error in deleteKpiAssignment controller:", error);
      return this.replyError(error);
    }
  }
}

export default KpiAssignmentController;

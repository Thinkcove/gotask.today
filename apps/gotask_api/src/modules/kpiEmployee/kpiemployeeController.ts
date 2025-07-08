import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { IKpiAssignment } from "../../domain/model/kpiemployee/kpiemloyeeModel";
import { KpiAssignmentMessages } from "../../constants/apiMessages/kpiemployeeMessages";
import {
  createKpiAssignment,
  deleteKpiAssignmentById,
  getAllKpiAssignments,
  getKpiAssignmentById,
  getTemplatesByUserId,
  updateKpiAssignment 
} from "./kpiemployeeService";
import { v4 as uuidv4 } from "uuid";
import { getKpiAssignmentByIdFromDb } from "../../domain/interface/kpiemployee/kpiemployeeInterface";
import { calculateKpiScores } from "../../constants/utils/common";

class KpiAssignmentController extends BaseController {
  // Create KPI Assignment
  async createKpiAssignment(
    requestHelper: RequestHelper,
    handler: any,
    restrictedFields: string[] = []
  ) {
    try {
      const assignmentData = requestHelper.getPayload() as Partial<IKpiAssignment>;
      const assignmentDataAny = assignmentData as any;

      restrictedFields.forEach((field) => {
        if (field in assignmentDataAny) {
          delete assignmentDataAny[field];
        }
      });

      if (
        !assignmentData.user_id ||
        !assignmentData.frequency ||
        !assignmentData.weightage ||
        !assignmentData.assigned_by ||
        (!assignmentData.template_id && !assignmentData.kpi_Title)
      ) {
        return this.replyError(new Error(KpiAssignmentMessages.CREATE.REQUIRED));
      }

      const authUserId = assignmentDataAny.authUserId || assignmentData.assigned_by;
      if (!authUserId) {
        return this.replyError(new Error(KpiAssignmentMessages.CREATE.REQUIRED));
      }

      const newAssignment = await createKpiAssignment(assignmentData, authUserId, restrictedFields);
      if (!newAssignment.success) {
        return this.replyError(
          new Error(newAssignment.message || KpiAssignmentMessages.CREATE.FAILED)
        );
      }

      return this.sendResponse(handler, newAssignment.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get All KPI Assignments for a User
  async getAllKpiAssignments(requestHelper: RequestHelper, handler: any) {
    try {
      const result = await getAllKpiAssignments();
      if (!result.success) {
        return this.replyError(new Error(result.message || KpiAssignmentMessages.FETCH.FAILED_ALL));
      }
      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get KPI Assignment by assignment_id
  async getKpiAssignmentById(requestHelper: RequestHelper, handler: any) {
    try {
      const assignment_id = requestHelper.getParam("assignment_id");
      if (!assignment_id) {
        return this.replyError(new Error(KpiAssignmentMessages.FETCH.ASSIGN_ID));
      }

      const result = await getKpiAssignmentById(assignment_id);
      if (!result.success) {
        return this.replyError(
          new Error(result.message || KpiAssignmentMessages.FETCH.FAILED_BY_ID)
        );
      }
      return this.sendResponse(handler, result.data);
    } catch (error) {
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
    if (!assignment_id) return this.replyError(new Error("Missing assignment ID"));

    const payload = requestHelper.getPayload() as Partial<IKpiAssignment>;
    const authUserId = (payload as any).authUserId;
    if (!authUserId) return this.replyError(new Error("Missing auth user ID"));

    const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
    if (!assignment) return this.replyError(new Error("Assignment not found"));

    // Handle performance update
    if (payload.performance && Array.isArray(payload.performance)) {
      const updatedPerformance = payload.performance.map((entry) => ({
        ...entry,
        performance_id: entry.performance_id || uuidv4(),
        updated_at: new Date(),
        added_by: assignment.reviewer_id || assignment.assigned_by,
        notes: entry.notes || []
      }));

      payload.performance = updatedPerformance;

      //  Combine old + new for score calculation
      const allPerformance = [...(assignment.performance || []), ...updatedPerformance];
      const targetVal = Number(assignment.target_value) || 0;

      const { actualValue } = calculateKpiScores(
        allPerformance,
        assignment.reviewer_id,
        assignment.assigned_by,
        targetVal
      );

      payload.actual_value = actualValue.toString();

    }

    const result = await updateKpiAssignment(assignment_id, payload, authUserId, restrictedFields);

    if (!result.success) {
      return this.replyError(new Error(result.message || "Failed to update assignment"));
    }

    return this.sendResponse(handler, result.data);
  } catch (error) {
    return this.replyError(error);
  }
}

  // Delete KPI Assignment
  async deleteKpiAssignment(requestHelper: RequestHelper, handler: any) {
    try {
      const assignment_id = requestHelper.getParam("assignment_id");
      if (!assignment_id) {
        return this.replyError(new Error(KpiAssignmentMessages.FETCH.ASSIGN_ID));
      }

      const result = await deleteKpiAssignmentById(assignment_id);
      if (!result.success) {
        return this.replyError(new Error(result.message || KpiAssignmentMessages.DELETE.FAILED));
      }
      return this.sendResponse(handler, { message: KpiAssignmentMessages.DELETE.SUCCESS });
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getTemplatesByUserId(requestHelper: RequestHelper, handler: any) {
    try {
      const user_id = requestHelper.getParam("user_id");

      if (!user_id) {
        return this.replyError(new Error(KpiAssignmentMessages.FETCH.USER_ID));
      }

      const result = await getTemplatesByUserId(user_id);

      if (!result.success) {
        return this.replyError(new Error(result.message));
      }

      return this.sendResponse(handler, result.data);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default KpiAssignmentController;

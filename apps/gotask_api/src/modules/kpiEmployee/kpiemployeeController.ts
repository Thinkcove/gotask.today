import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { KpiAssignmentMessages } from "../../constants/apiMessages/kpiemployeeMessages";
import {
  calculateKpiScores,
  createKpiAssignment,
  deleteKpiAssignmentById,
  getAllKpiAssignments,
  getKpiAssignmentById,
  getTemplatesByUserId,
  updateKpiAssignment
} from "./kpiemployeeService";
import { v4 as uuidv4 } from "uuid";
import { getKpiAssignmentByIdFromDb } from "../../domain/interface/kpiemployee/kpiemployeeInterface";
import { IKpiAssignment } from "../../domain/model/kpiemployee/kpiEmployeeModel";

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
      if (!assignment_id) {
        return this.replyError(new Error(KpiAssignmentMessages.FETCH.ASSIGN_ID));
      }

      const payload = requestHelper.getPayload() as Partial<IKpiAssignment>;
      const authUserId = (payload as any).authUserId;
      if (!authUserId) {
        return this.replyError(new Error(KpiAssignmentMessages.FETCH.USER_ID));
      }

      const assignment = await getKpiAssignmentByIdFromDb(assignment_id);
      if (!assignment) {
        return this.replyError(new Error(KpiAssignmentMessages.FETCH.NOT_FOUND));
      }

      // Handle performance update
      if (payload.performance && Array.isArray(payload.performance)) {
        const updatedPerformance = payload.performance.map((entry) => ({
          ...entry,
          performance_id: entry.performance_id || uuidv4(),
          updated_at: new Date(),
          added_by: assignment.reviewer_id || assignment.assigned_by || assignment.user_id,
          notes: entry.notes || []
        }));

        // Combine existing and new performance, avoid duplicates by performance_id
        const combinedMap = new Map<string, any>();
        [...(assignment.performance || []), ...updatedPerformance].forEach((perf) => {
          combinedMap.set(perf.performance_id, perf);
        });

        const allPerformance = Array.from(combinedMap.values());
        payload.performance = allPerformance;

        // Calculate actual percentage score from matching added_by
        const targetVal = Number(assignment.target_value) || 0;

        const { actual_value, employee_score } = calculateKpiScores(
          allPerformance,
          assignment.reviewer_id,
          assignment.assigned_by,
          targetVal,
          assignment.user_id
        );

        payload.actual_value = actual_value.toString();
        payload.employee_score = employee_score.toString();
      }

      const result = await updateKpiAssignment(
        assignment_id,
        payload,
        authUserId,
        restrictedFields
      );

      if (!result.success) {
        return this.replyError(new Error(result.message || KpiAssignmentMessages.UPDATE.FAILED));
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

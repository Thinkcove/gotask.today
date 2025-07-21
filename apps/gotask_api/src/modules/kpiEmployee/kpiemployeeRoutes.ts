import { Request, ResponseToolkit } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import authStrategy from "../../constants/auth/authStrategy";
import KpiAssignmentController from "./kpiemployeeController";
import { KpiAssignmentMessages } from "../../constants/apiMessages/kpiemployeeMessages";

const kpiAssignmentController = new KpiAssignmentController();
const tags = [API, "KpiAssignment"];
const KpiAssignmentRoutes = [];

// Route: Create KPI Assignment
KpiAssignmentRoutes.push({
  path: "/createEmployeeAssignment",
  method: API_METHODS.POST,
  handler: (request: Request, h: ResponseToolkit, restrictedFields: string[]) =>
    kpiAssignmentController.createKpiAssignment(new RequestHelper(request), h, restrictedFields),
  config: {
    notes: "Create a new KPI assignment",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    },
    validate: {
      payload: (payload: any) => {
        if (!payload.authUserId && !payload.assigned_by) {
          throw new Error("authUserId or assigned_by is required in payload");
        }
        return payload;
      }
    }
  }
});

// Route: Get All KPI Assignments
KpiAssignmentRoutes.push({
  path: "/getAllAssignments",
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiAssignmentController.getAllKpiAssignments(new RequestHelper(request), h),
  config: {
    notes: "Get all KPI assignments for a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get KPI Assignment by assignment_id
KpiAssignmentRoutes.push({
  path: "/getAssignmentById/{assignment_id}",
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiAssignmentController.getKpiAssignmentById(new RequestHelper(request), h),
  config: {
    notes: "Get KPI assignment by assignment_id",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    },
    validate: {
      params: (params: any) => {
        if (!params.assignment_id) {
          throw new Error("assignment_id is required in params");
        }
        return params;
      }
    }
  }
});

// Route: Update KPI Assignment
KpiAssignmentRoutes.push({
  path: "/updateAssignment/{assignment_id}",
  method: API_METHODS.PUT,
  handler: (request: Request, h: ResponseToolkit, restrictedFields: string[]) =>
    kpiAssignmentController.updateKpiAssignment(new RequestHelper(request), h, restrictedFields),
  config: {
    notes: "Update KPI assignment by assignment_id",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Add Performance to KPI Assignment
KpiAssignmentRoutes.push({
  path: "/addPerformance/{assignment_id}",
  method: API_METHODS.PUT,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiAssignmentController.addPerformanceToKpiAssignment(new RequestHelper(request), h),
  config: {
    notes: "Add performance entries to a KPI assignment",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    },
    validate: {
      params: (params: any) => {
        if (!params.assignment_id) {
          throw new Error(KpiAssignmentMessages.CREATE.ASSIGNMENT_ID_REQUIRED);
        }
        return params;
      },
      payload: (payload: any) => {
        if (!payload.performance || !Array.isArray(payload.performance)) {
          throw new Error(KpiAssignmentMessages.CREATE.PERFORMANCE_ID);
        }
        if (!payload.authUserId) {
          throw new Error(KpiAssignmentMessages.CREATE.USER_ID);
        }
        return payload;
      }
    }
  }
});

// Route: Get Performance by performance_id within a specific assignment
KpiAssignmentRoutes.push({
  path: "/getPerformance/{performance_id}",
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiAssignmentController.getPerformanceById(new RequestHelper(request), h),
  config: {
    notes: "Get performance entry by performance_id and return assignment as well",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    },
    validate: {
      params: (params: any) => {
        if (!params.performance_id) {
          throw new Error(KpiAssignmentMessages.CREATE.PERFORMANCE_ID);
        }
        return params;
      }
    }
  }
});

// Route: Delete KPI Assignment
KpiAssignmentRoutes.push({
  path: "/deleteAssignment/{assignment_id}",
  method: API_METHODS.DELETE,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiAssignmentController.deleteKpiAssignment(new RequestHelper(request), h),
  config: {
    notes: "Delete KPI assignment by assignment_id",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get Templates by user_id
KpiAssignmentRoutes.push({
  path: "/getTemplatesByUserId/{user_id}",
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiAssignmentController.getTemplatesByUserId(new RequestHelper(request), h),
  config: {
    notes: "Get all KPI templates associated with a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

KpiAssignmentRoutes.push({
  path: "/performance/{assignment_id}",
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiAssignmentController.getPerformancesByAssignmentId(new RequestHelper(request), h),
  config: {
    notes: "Get all performance entries under a KPI assignment using assignment_id",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default KpiAssignmentRoutes;

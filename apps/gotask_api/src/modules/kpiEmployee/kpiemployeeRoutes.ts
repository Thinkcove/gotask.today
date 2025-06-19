// import { Request, ResponseToolkit } from "@hapi/hapi";
// import { API_PATHS } from "../../constants/api/apiPaths";
// import { API, API_METHODS } from "../../constants/api/apiMethods";
// import RequestHelper from "../../helpers/requestHelper";
// import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
// import authStrategy from "../../constants/auth/authStrategy";
// import KpiAssignmentController from "./kpiemployeeController";

// const kpiAssignmentController = new KpiAssignmentController();
// const appName = APPLICATIONS.KPI;
// const tags = [API, "KpiAssignment"];
// const KpiAssignmentRoutes = [];

// // Route: Create KPI Assignment
// KpiAssignmentRoutes.push({
//   path: API_PATHS.CREATE_EMPLOYEE_ASSIGNMENT,
//   method: API_METHODS.POST,
//   handler: (request: Request, h: ResponseToolkit, restrictedFields: string[]) =>
//     kpiAssignmentController.createKpiAssignment(new RequestHelper(request), h, restrictedFields),
//   config: {
//     notes: "Create a new KPI assignment",
//     tags,
//     auth: {
//       strategy: authStrategy.SIMPLE
//     }
//   }
// });

// // Route: Get All KPI Assignments
// KpiAssignmentRoutes.push({
//   path: API_PATHS.GET_EMPLOYEE_ASSIGNMENTS,
//   method: API_METHODS.GET,
//   handler: (request: Request, h: ResponseToolkit) =>
//     kpiAssignmentController.getAllKpiAssignments(new RequestHelper(request), h),
//   config: {
//     notes: "Get all KPI assignments for a user",
//     tags,
//     auth: {
//       strategy: authStrategy.SIMPLE
//     }
//   }
// });

// // Route: Get KPI Assignment by assignment_id
// KpiAssignmentRoutes.push({
//   path: API_PATHS.GET_EMPLOYEE_ASSIGNMENT_BY_ID,
//   method: API_METHODS.GET,
//   handler: (request: Request, h: ResponseToolkit) =>
//     kpiAssignmentController.getKpiAssignmentById(new RequestHelper(request), h),
//   config: {
//     notes: "Get KPI assignment by assignment_id",
//     tags,
//     auth: {
//       strategy: authStrategy.SIMPLE
//     }
//   }
// });

// // Route: Update KPI Assignment
// KpiAssignmentRoutes.push({
//   path: API_PATHS.UPDATE_EMPLOYEE_ASSIGNMENT,
//   method: API_METHODS.PUT,
//   handler: (request: Request, h: ResponseToolkit, restrictedFields: string[]) =>
//     kpiAssignmentController.updateKpiAssignment(new RequestHelper(request), h, restrictedFields),
//   config: {
//     notes: "Update KPI assignment by assignment_id",
//     tags,
//     auth: {
//       strategy: authStrategy.SIMPLE
//     }
//   }
// });

// // Route: Delete KPI Assignment
// KpiAssignmentRoutes.push({
//   path: API_PATHS.DELETE_EMPLOYEE_ASSIGNMENT,
//   method: API_METHODS.DELETE,
//   handler: (request: Request, h: ResponseToolkit) =>
//     kpiAssignmentController.deleteKpiAssignment(new RequestHelper(request), h),
//   config: {
//     notes: "Delete KPI assignment by assignment_id",
//     tags,
//     auth: {
//       strategy: authStrategy.SIMPLE
//     }
//   }
// });

// export default KpiAssignmentRoutes;

import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";
import KpiAssignmentController from "./kpiemployeeController";

const kpiAssignmentController = new KpiAssignmentController();
const appName = APPLICATIONS.KPI;
const tags = [API, "KpiAssignment"];
const KpiAssignmentRoutes = [];

// Route: Create KPI Assignment
KpiAssignmentRoutes.push({
  path: API_PATHS.CREATE_EMPLOYEE_ASSIGNMENT,
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
  path: API_PATHS.GET_EMPLOYEE_ASSIGNMENTS,
  method: API_METHODS.GET,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiAssignmentController.getAllKpiAssignments(new RequestHelper(request), h),
  config: {
    notes: "Get all KPI assignments for a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    },
    validate: {
      query: (query: any) => {
        if (!query.user_id) {
          throw new Error("user_id is required in query");
        }
        return query;
      }
    }
  }
});

// Route: Get KPI Assignment by assignment_id
KpiAssignmentRoutes.push({
  path: API_PATHS.GET_EMPLOYEE_ASSIGNMENT_BY_ID,
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
  path: API_PATHS.UPDATE_EMPLOYEE_ASSIGNMENT,
  method: API_METHODS.PUT,
  handler: (request: Request, h: ResponseToolkit, restrictedFields: string[]) =>
    kpiAssignmentController.updateKpiAssignment(new RequestHelper(request), h, restrictedFields),
  config: {
    notes: "Update KPI assignment by assignment_id",
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
      },
      payload: (payload: any) => {
        if (!payload.authUserId) {
          throw new Error("authUserId is required in payload");
        }
        return payload;
      }
    }
  }
});

// Route: Delete KPI Assignment
KpiAssignmentRoutes.push({
  path: API_PATHS.DELETE_EMPLOYEE_ASSIGNMENT,
  method: API_METHODS.DELETE,
  handler: (request: Request, h: ResponseToolkit) =>
    kpiAssignmentController.deleteKpiAssignment(new RequestHelper(request), h),
  config: {
    notes: "Delete KPI assignment by assignment_id",
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
      },
      payload: (payload: any) => {
        if (!payload.authUserId) {
          throw new Error("authUserId is required in payload");
        }
        return payload;
      }
    }
  }
});

export default KpiAssignmentRoutes;

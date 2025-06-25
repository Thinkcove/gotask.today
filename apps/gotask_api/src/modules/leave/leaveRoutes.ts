import { Request, ResponseToolkit } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import authStrategy from "../../constants/auth/authStrategy";
import LeaveController from "./leaveController";

const leaveController = new LeaveController();
const tags = [API, "Leave"];

const LeaveRoutes = [];

LeaveRoutes.push({
  path: "/leave",
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    leaveController.createLeave(new RequestHelper(request), handler),
  config: {
    notes: "Create a new leave request",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

LeaveRoutes.push({
  path: "/getallleave",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    leaveController.getAllLeaves(new RequestHelper(request), handler),
  config: {
    notes: "Get all leave requests",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

LeaveRoutes.push({
  path: "/getleaves",
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    leaveController.getLeavesWithFilters(new RequestHelper(request), handler),
  config: {
    notes: "Get leave requests with filters (user_id, leave_type, date range)",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

LeaveRoutes.push({
  path: "/getleavebyid/{id}",
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    leaveController.getLeaveById(new RequestHelper(request), handler),
  config: {
    notes: "Get leave request by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

LeaveRoutes.push({
  path: "/leave/{id}",
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    leaveController.updateLeave(new RequestHelper(request), handler),
  config: {
    notes: "Update an existing leave request",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

LeaveRoutes.push({
  path: "/leave/{id}",
  method: API_METHODS.DELETE,
  handler: (request: Request, handler: ResponseToolkit) =>
    leaveController.deleteLeave(new RequestHelper(request), handler),
  config: {
    notes: "Delete a leave request",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default LeaveRoutes;

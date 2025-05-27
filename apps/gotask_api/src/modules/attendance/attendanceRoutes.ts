import { Request, ResponseToolkit } from "@hapi/hapi";
import attendanceController from "./attendanceController";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";
import fs from "fs/promises";
import path from "path";

const appName = APPLICATIONS.ATTENDANCE;
const tags = [API, "Attendance"];
const AttendanceRoutes = [];

AttendanceRoutes.push({
  path: "/api/attendance",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    attendanceController.createAttendance(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create a new attendance record",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

AttendanceRoutes.push({
  path: "/api/attendance/query",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    attendanceController.processAttendanceQuery(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Process general attendance query",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

AttendanceRoutes.push({
  path: "/api/attendance/employee/query",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    attendanceController.processEmployeeAttendanceQuery(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Process employee-specific attendance query",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

export default AttendanceRoutes;

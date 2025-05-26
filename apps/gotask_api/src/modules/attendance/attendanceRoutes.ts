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
  path: API_PATHS.CREATE_ATTENDANCE,
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
  path: API_PATHS.UPLOAD_ATTENDANCE,
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    attendanceController.uploadAttendance(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Upload attendance from Excel file",
    tags,
    auth: { strategy: authStrategy.SIMPLE },
    payload: {
      maxBytes: 10485760, // 10MB
      output: "file",
      parse: true,
      multipart: {
        output: "file"
      }
    },
    pre: [
      {
        method: async (request: Request, h: ResponseToolkit) => {
          const payload = request.payload as any;
          if (!payload || !payload.file) {
            throw new Error("No file uploaded");
          }

          const uploadDir = path.join(__dirname, "../../../Uploads");
          await fs.mkdir(uploadDir, { recursive: true });

          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const filePath = path.join(uploadDir, `attendance-${uniqueSuffix}.xlsx`);

          await fs.writeFile(filePath, payload.file);

          payload.file = { path: filePath };

          return h.continue;
        },
        assign: "fileHandler"
      }
    ]
  }
});

AttendanceRoutes.push({
  path: API_PATHS.PROCESS_ATTENDANCE_QUERY,
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
  path: API_PATHS.PROCESS_EMPLOYEE_ATTENDANCE_QUERY,
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

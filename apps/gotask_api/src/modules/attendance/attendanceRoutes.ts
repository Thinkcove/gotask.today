import { Request, ResponseToolkit } from "@hapi/hapi";
import attendanceController from "./attendanceController";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";
import fs from "fs/promises";
import { createWriteStream } from "node:fs";
import path from "path";
import { ATTENDANCE_CONST } from "../../constants/commonConstants/queryConstants";
import { pipeline } from "stream/promises";

const AttendanceController = new attendanceController();
const appName = APPLICATIONS.CHATBOT;
const tags = [API, "Chatbot"];
const AttendanceRoutes = [];

// Route: Create Attendance
AttendanceRoutes.push({
  path: "/api/attendance",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    AttendanceController.createAttendance(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create a new attendance record",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Process General Attendance Query
AttendanceRoutes.push({
  path: "/api/attendance/query",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    AttendanceController.processAttendanceQuery(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Process general attendance query",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Process Employee-Specific Attendance Query
AttendanceRoutes.push({
  path: "/api/attendance/employee/query",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    AttendanceController.processEmployeeAttendanceQuery(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Process employee-specific attendance query",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

// Route: Upload Attendance
AttendanceRoutes.push({
  path: "/api/attendance/upload",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: any, handler: any) =>
    AttendanceController.uploadAttendance(new RequestHelper(request), handler)
  ),
  config: {
    tags,
    description: "Upload attendance from Excel file",
    auth: { strategy: authStrategy.SIMPLE },
    payload: {
      maxBytes: ATTENDANCE_CONST.BYTE_LIMIT,
      output: "stream",
      parse: true,
      multipart: true
    },
    pre: [
      {
        method: async (request: Request, h: ResponseToolkit) => {
          const payload = request.payload as any;
          if (!payload) {
            throw new Error("No payload received");
          }
          if (!payload.file) {
            throw new Error('No file provided in payload. Expected key: "file"');
          }

          const uploadDir = path.join(__dirname, "./Uploads");
          await fs.mkdir(uploadDir, { recursive: true });

          const originalFilename = payload.file.filename || "attendance.xlsx";
          const extension = path.extname(originalFilename) || ".xlsx";
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
          const filePath = path.join(uploadDir, `attendance-${uniqueSuffix}${extension}`);

          const fileStream = payload.file;
          const writeStream = createWriteStream(filePath);
          await pipeline(fileStream, writeStream);

          (request.payload as any).file = { path: filePath };

          return h.continue;
        },
        assign: "fileHandler"
      }
    ]
  }
});

export default AttendanceRoutes;

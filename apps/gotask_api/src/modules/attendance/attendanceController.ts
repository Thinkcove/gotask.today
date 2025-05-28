import { ResponseToolkit } from "@hapi/hapi";
import BaseController from "../../common/baseController";
import RequestHelper from "../../helpers/requestHelper";
import {
  addAttendance,
  processQuery,
  processEmployeeQuery,
  uploadAttendance
} from "./attendanceService";

interface UploadPayload {
  file?: {
    path: string;
  };
}

class AttendanceController extends BaseController {
  async createAttendance(requestHelper: RequestHelper, handler: any) {
    try {
      const { empname, empcode, date, inTime, outTime } = requestHelper.getPayload();
      if (!empname || !empcode || !date || !inTime || !outTime) {
        throw new Error("Please provide empname, empcode, date, inTime, and outTime.");
      }

      const result = await addAttendance(empname, empcode, new Date(date), inTime, outTime);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async processAttendanceQuery(requestHelper: RequestHelper, handler: any) {
    try {
      const { query, parsedQuery } = requestHelper.getPayload();
      if (!query || !parsedQuery) {
        throw new Error("Query and parsedQuery are required.");
      }

      const result = await processQuery(query, parsedQuery);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async processEmployeeAttendanceQuery(requestHelper: RequestHelper, handler: any) {
    try {
      const { query, parsedQuery } = requestHelper.getPayload();
      if (!query || !parsedQuery) {
        throw new Error("Query and parsedQuery are required.");
      }

      const result = await processEmployeeQuery(query, parsedQuery);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async uploadAttendance(requestHelper: RequestHelper, h: ResponseToolkit) {
    try {
      const payload = requestHelper.getPayload<UploadPayload>();
      if (!payload || !payload.file?.path) {
        return h
          .response({
            success: false,
            data: { inserted: 0, skipped: 0, errors: ["No file provided in payload"] },
            message: "Failed to process attendance upload"
          })
          .code(400);
      }

      const filePath = payload.file.path;
      const result = await uploadAttendance(filePath);
      return h.response(result).code(result.success ? 200 : 400);
    } catch (error: any) {
      return h
        .response({
          success: false,
          data: { inserted: 0, skipped: 0, errors: [error.message] },
          message: "Failed to process attendance upload"
        })
        .code(500);
    }
  }
}

export default AttendanceController;

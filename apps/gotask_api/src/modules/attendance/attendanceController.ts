import { Request, ResponseToolkit } from "@hapi/hapi";
import fs from "fs/promises";
import BaseController from "../../common/baseController";
import { upload } from "../../common/multerConfig";
import RequestHelper from "../../helpers/requestHelper";
import {
  addAttendance,
  uploadAttendance,
  processQuery,
  processEmployeeQuery
} from "./attendanceService";

class AttendanceController extends BaseController {
  async createAttendance(requestHelper: RequestHelper, handler: any) {
    try {
      const { empname, empcode, date, inTime, outTime } = requestHelper.getPayload();
      if (!empname || !empcode || !date || !inTime || !outTime) {
        throw new Error("Please provide empcode, date, inTime, and outTime.");
      }

      const result = await addAttendance(empname, empcode, new Date(date), inTime, outTime);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async uploadAttendance(requestHelper: RequestHelper, handler: any) {
    try {
      const request = requestHelper.getRequest();
      const payload = request.payload as any;
      if (!payload || !payload.file || !payload.file.path) {
        throw new Error("No file uploaded.");
      }

      const filePath = payload.file.path;
      const result = await uploadAttendance(filePath);

      await fs.unlink(filePath);

      return this.sendResponse(handler, result);
    } catch (error: any) {
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
}

export default new AttendanceController();

import BaseController from "../../common/baseController";
import { AttendanceMessages } from "../../constants/apiMessages/attendanceMessage";
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
        throw new Error(AttendanceMessages.CREATE.REQUIRED);
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
        throw new Error(AttendanceMessages.QUERY.PARSE);
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
        throw new Error(AttendanceMessages.QUERY.PARSE);
      }

      const result = await processEmployeeQuery(query, parsedQuery);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async uploadAttendance(requestHelper: RequestHelper, handler: any) {
    try {
      const payload = requestHelper.getPayload<UploadPayload>();
      if (!payload || !payload.file?.path) {
        throw new Error(AttendanceMessages.UPLOAD.NOT_FOUND);
      }

      const filePath = payload.file.path;
      const result = await uploadAttendance(filePath);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default AttendanceController;

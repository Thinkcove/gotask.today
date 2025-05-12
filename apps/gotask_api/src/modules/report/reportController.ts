import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { getUserTimeReportService } from "./reportService";

class ReportController extends BaseController {
  // timeReport
  async getUserTimeReport(requestHelper: RequestHelper, handler: any) {
    try {
      const { fromDate, toDate, userIds, showTasks, showProjects } = requestHelper.getPayload();

      const result = await getUserTimeReportService(
        fromDate,
        toDate,
        userIds,
        showTasks,
        showProjects
      );

      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default ReportController;

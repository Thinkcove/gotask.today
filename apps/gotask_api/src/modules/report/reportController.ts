import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { getUserTimeLogService } from "./reportService";

class ReportController extends BaseController {
  // timeReport
  async getUserTimeLog(requestHelper: RequestHelper, handler: any) {
    try {
      const rawPayload = requestHelper.getPayload();
      console.log("RAW PAYLOAD >>>", rawPayload); // 👈 Add this line

      const {
        from,
        to,
        users,
        projectIds,
        includeTasks = false,
        includeProject = false
      } = rawPayload;

      const result = await getUserTimeLogService({
        from,
        to,
        users,
        projectIds,
        includeTasks,
        includeProject
      });
      console.log("result", result);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default ReportController;

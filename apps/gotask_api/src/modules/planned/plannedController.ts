  import RequestHelper from "../../helpers/requestHelper";
  import BaseController from "../../common/baseController";
  import { getWorkPlannedService } from "./plannedService";


  class WorkPlannedController extends BaseController {
    // Get work planned report
    async getWorkPlanned(requestHelper: RequestHelper, handler: any) {
      try {
        const { fromDate, toDate, userIds, showTasks, selectedProjects } = requestHelper.getPayload();

        const result = await getWorkPlannedService(
          fromDate,
          toDate,
          userIds,
          showTasks,
          selectedProjects
        );

        return this.sendResponse(handler, result);
      } catch (error) {
        return this.replyError(error, handler);
      }
    }
  }

  export default WorkPlannedController;
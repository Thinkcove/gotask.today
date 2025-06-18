import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import authStrategy from "../../constants/auth/authStrategy";
import WorkPlannedController from "./plannedController";

const workPlannedController = new WorkPlannedController();
const tags = [API, "Work Planned"];

const WorkPlannedRoutes = [];

// Route: Get Work Planned
WorkPlannedRoutes.push({
  path: API_PATHS.GET_WORK_PLANNED,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    workPlannedController.getWorkPlanned(new RequestHelper(request), handler),
  config: {
    notes: "Get work planned - tasks created within date range",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default WorkPlannedRoutes;

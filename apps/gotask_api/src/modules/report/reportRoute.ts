import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import { permission } from "../../middleware/permission";
import authStrategy from "../../constants/auth/authStrategy";
import ReportController from "./reportController";

const reportController = new ReportController();
const appName = APPLICATIONS.REPORT;
const tags = [API, "Report"];
const ReportRoutes = [];

// Route : user Report
ReportRoutes.push({
  path: API_PATHS.GET_USER_TIME_LOG,
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    reportController.getUserTimeReport(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get daily user time logs within date range",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default ReportRoutes;

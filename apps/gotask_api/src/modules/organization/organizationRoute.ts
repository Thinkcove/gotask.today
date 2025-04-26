import { Request, ResponseToolkit } from "@hapi/hapi";
import OrganizationController from "./organizationController";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";

const organizationController = new OrganizationController();

const tags = [API, "Organization"];
const OrganizationRoutes = [];

// Route: Create Organization
OrganizationRoutes.push({
  path: API_PATHS.CREATE_ORGANIZATION,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    organizationController.createOrganization(new RequestHelper(request), handler),
  config: {
    notes: "Create a New Organization",
    tags
  }
});

// Route: Get All Organizations
OrganizationRoutes.push({
  path: API_PATHS.GET_ORGANIZATIONS,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    organizationController.getAllOrganizations(new RequestHelper(request), handler),
  config: {
    notes: "Get All Organizations",
    tags
  }
});

export default OrganizationRoutes;

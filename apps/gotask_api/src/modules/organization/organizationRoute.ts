import { Request, ResponseToolkit } from "@hapi/hapi";
import OrganizationController from "./organizationController";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const organizationController = new OrganizationController();
const appName = APPLICATIONS.ORGANIZATION;
const tags = [API, "Organization"];
const OrganizationRoutes = [];

// Route: Create Organization
OrganizationRoutes.push({
  path: API_PATHS.CREATE_ORGANIZATION,
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    organizationController.createOrganization(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create a New Organization",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get All Organizations
OrganizationRoutes.push({
  path: API_PATHS.GET_ORGANIZATIONS,
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    organizationController.getAllOrganizations(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get All Organizations",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get Org by ID
OrganizationRoutes.push({
  path: API_PATHS.GET_ORG_BY_ID, // e.g. /getOrgById/{id}
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.VIEW, (request: Request, handler: ResponseToolkit) =>
    organizationController.getOrgById(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get an organization by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE,
      mode: "try"
    }
  }
});

// Route: Update Organization
OrganizationRoutes.push({
  path: API_PATHS.UPDATE_ORGANIZATION,
  method: API_METHODS.PUT,
  handler: permission(appName, ACTIONS.UPDATE, (request: Request, handler: ResponseToolkit) =>
    organizationController.updateOrg(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Update organization details",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});
export default OrganizationRoutes;

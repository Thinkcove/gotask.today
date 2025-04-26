import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { createOrganization, getAllOrganizations } from "./organizationService";

class OrganizationController extends BaseController {
  // Create a new organization
  async createOrganization(requestHelper: RequestHelper, handler: any) {
    try {
      const organizationData = requestHelper.getPayload();
      if (!organizationData) {
        throw new Error("Missing required fields");
      }
      const newOrganization = await createOrganization(organizationData);
      return this.sendResponse(handler, newOrganization);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get all organizations
  async getAllOrganizations(_requestHelper: RequestHelper, handler: any) {
    try {
      const organizations = await getAllOrganizations();
      return this.sendResponse(handler, organizations);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default OrganizationController;

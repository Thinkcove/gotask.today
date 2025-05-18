import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import UserPreferenceController from "./userPreferenceController";

const userPreferenceController = new UserPreferenceController();
const tags = [API, "UserPreference"];
const UserPreferenceRoutes = [];

UserPreferenceRoutes.push({
  path: API_PATHS.SET_USER_PREFERENCES,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    userPreferenceController.setUserPreferences(new RequestHelper(request), handler),
  config: {
    notes: "Set field exclusions for each module per user",
    tags
  }
});

UserPreferenceRoutes.push({
  path: API_PATHS.GET_USER_PREFERENCES,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    userPreferenceController.getUserPreferences(new RequestHelper(request), handler),
  config: {
    notes: "Get field exclusions per user",
    tags
  }
});

export default UserPreferenceRoutes;

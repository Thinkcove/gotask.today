import { Request, ResponseToolkit } from "@hapi/hapi";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import queryController from "./queryController";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const appName = APPLICATIONS.CHATBOT;
const tags = [API, "Chatbot"];
const QueryRoutes = [];

QueryRoutes.push({
  path: "/api/query",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    queryController.processQuery(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Process a generic query",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE,
      scope: false
    }
  }
});

QueryRoutes.push({
  path: "/api/query/history",
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    queryController.getQueryHistory(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Retrieve query history",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE,
      scope: false
    }
  }
});

QueryRoutes.push({
  path: "/api/query/history/clear",
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, handler: ResponseToolkit) =>
    queryController.clearQueryHistory(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Clear query history",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE,
      scope: false
    }
  }
});

QueryRoutes.push({
  path: "/api/query/conversation/{id}",
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, handler: ResponseToolkit) =>
    queryController.deleteConversation(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Delete a conversation by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE,
      scope: false
    }
  }
});

export default QueryRoutes;

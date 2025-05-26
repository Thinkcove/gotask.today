import { Request, ResponseToolkit } from "@hapi/hapi";
import BaseController from "../../common/baseController";
import RequestHelper from "../../helpers/requestHelper";
import {
  processQuery,
  getQueryHistory,
  clearQueryHistory,
  deleteConversation
} from "./queryService";

class QueryController extends BaseController {
  async processQuery(requestHelper: RequestHelper, handler: any) {
    try {
      const { query, conversationId } = requestHelper.getPayload();
      if (!query) {
        throw new Error("Query is required.");
      }

      const result = await processQuery(query, conversationId);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getQueryHistory(requestHelper: RequestHelper, handler: any) {
    try {
      const { limit } = requestHelper.getQuery();
      const result = await getQueryHistory(limit ? parseInt(limit) : 10);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async clearQueryHistory(requestHelper: RequestHelper, handler: any) {
    try {
      const result = await clearQueryHistory();
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async deleteConversation(requestHelper: RequestHelper, handler: any) {
    try {
      const { conversationId } = requestHelper.getParam("id");
      if (!conversationId) {
        throw new Error("Conversation ID is required.");
      }

      const result = await deleteConversation(conversationId);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default new QueryController();

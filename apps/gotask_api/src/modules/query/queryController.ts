import BaseController from "../../common/baseController";
import { QueryMessages } from "../../constants/apiMessages/queryMessages";
import { QUERY_LIMIT } from "../../constants/commonConstants/queryConstants";
import { QueryHistoryResponse } from "../../domain/model/query/queryModel";
import RequestHelper from "../../helpers/requestHelper";
import {
  processQuery,
  getQueryHistory,
  clearQueryHistory,
  deleteConversation,
  getQueryHistoryByConversationIdService
} from "./queryService";

class QueryController extends BaseController {
  async processQuery(requestHelper: RequestHelper, handler: any) {
    try {
      const { query, conversationId } = requestHelper.getPayload();
      if (!query) {
        throw new Error(QueryMessages.QUERY.REQUIRED);
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
      const result = await getQueryHistory(limit ? parseInt(limit) : QUERY_LIMIT.HISTORY_LIMIT);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }

  async getConversationHistory(requestHelper: RequestHelper, handler: any) {
    try {
      const conversationId = requestHelper.getParam("conversationId");
      if (!conversationId) {
        throw new Error(QueryMessages.CONVERSATION.REQUIRED);
      }

      const result: QueryHistoryResponse =
        await getQueryHistoryByConversationIdService(conversationId);
      if (!result.success) {
        return handler.response(result).code(404);
      }

      return handler.response(result).code(200);
    } catch (error: any) {
      return handler.response({ success: false, message: error.message }).code(500);
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
      const conversationId = requestHelper.getParam("id");
      if (!conversationId) {
        throw new Error(QueryMessages.CONVERSATION.REQUIRED);
      }

      const result = await deleteConversation(conversationId);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error, handler);
    }
  }
}

export default new QueryController();

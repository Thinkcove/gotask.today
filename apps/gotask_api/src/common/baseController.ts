import * as Boom from "@hapi/boom";
import httpStatus from "http-status";

import ErrorMessages from "./errorMessage";
import logger from "./logger";

const setDataInError = (err: Boom.Boom, data?: any): Boom.Boom => {
  err.output.payload.details = data || err.data;
  return err;
};

const sendError = (
  errorHandler: (message: string, data?: any) => Boom.Boom,
  message: string,
  data?: any
): Boom.Boom => {
  const err = errorHandler(message, data);
  return setDataInError(err, data);
};

const sendDbError = (ex: any): Boom.Boom => {
  if (ex.code === "ConditionalCheckFailedException") {
    return sendError(Boom.conflict, ex.message, ex.data);
  }
  if (ex.code === "NetworkingError") {
    return Boom.badGateway("Unable to connect to database", ex.message);
  }
  return sendError(Boom.badGateway, ex.message);
};

const sendExternalApiErrors = (ex: any, errorMessages: any): Boom.Boom => {
  const exceptionResponse = ex && ex.response;
  if (!exceptionResponse) {
    const errorMsg = errorMessages.getErrorMessage(httpStatus.INTERNAL_SERVER_ERROR);
    return sendError(Boom.internal, errorMsg, errorMsg);
  }
  const customErrorData = errorMessages.getErrorMessage(exceptionResponse.status);
  const customMessage =
    (customErrorData && customErrorData.message) ||
    exceptionResponse.data.message ||
    exceptionResponse.data.description;
  const err = new Boom.Boom(customMessage, {
    statusCode: exceptionResponse.status,
    data: exceptionResponse.data
  });
  return setDataInError(err, exceptionResponse.data);
};

/* eslint class-methods-use-this: ["error", { "exceptMethods": ["sendResponse"] }] */
class BaseController {
  sendResponse(handler: any, response: any): any {
    return handler.response(response).type("application/json").code(httpStatus.OK);
  }

  replyError(ex: any, errorMessages: ErrorMessages = new ErrorMessages()): Boom.Boom {
    logger.error(ex);
    const className = this.constructor.name.replace("Controller", "");
    errorMessages.addErrorMessage(httpStatus.INTERNAL_SERVER_ERROR, `${className} Service Error`);
    // DynamoDB Errors
    if (ex && ex.type === "dynamo") {
      return sendDbError(ex);
    }
    // Customized Boom error, Boom errors we throw from services or controller will reach here
    if (ex && ex.isBoom === true) {
      const customMessage = errorMessages.getErrorMessage(ex.output.statusCode);
      if (customMessage) {
        ex.output.payload.message = customMessage.message;
      }
      return setDataInError(ex, customMessage && customMessage.details);
    }
    // Joi validation error
    if (ex && ex.isJoi) {
      return sendError(Boom.badData, ex, ex.details);
    }
    return sendExternalApiErrors(ex, errorMessages);
  }
}

export default BaseController;

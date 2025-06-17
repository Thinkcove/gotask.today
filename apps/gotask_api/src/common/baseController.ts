import * as Boom from "@hapi/boom";
import httpStatus from "http-status";
import ErrorMessages from "./errorMessage";
import logger from "./logger";

// Utility to attach additional data to Boom errors
const setDataInError = (err: Boom.Boom, data?: any): Boom.Boom => {
  err.output.payload.details = data || err.data;
  return err;
};

// Send standard error using Boom type and additional data
const sendError = (
  errorHandler: (message: string, data?: any) => Boom.Boom,
  message: string,
  data?: any
): Boom.Boom => {
  const err = errorHandler(message, data);
  return setDataInError(err, data);
};

// Handle known DB errors
const sendDbError = (ex: any): Boom.Boom => {
  if (ex.code === "ConditionalCheckFailedException") {
    return sendError(Boom.conflict, ex.message, ex.data);
  }
  if (ex.code === "NetworkingError") {
    return Boom.badGateway("Unable to connect to database", ex.message);
  }
  return sendError(Boom.badGateway, ex.message);
};

// Handle HTTP errors from external APIs
const sendExternalApiErrors = (ex: any, errorMessages: any): Boom.Boom => {
  const exceptionResponse = ex?.response;
  if (!exceptionResponse) {
    const errorMsg = errorMessages.getErrorMessage?.(httpStatus.INTERNAL_SERVER_ERROR) || {
      message: "Internal server error"
    };
    return sendError(Boom.internal, errorMsg.message, errorMsg);
  }

  const customErrorData = errorMessages.getErrorMessage?.(exceptionResponse.status);
  const customMessage =
    customErrorData?.message ||
    exceptionResponse.data?.message ||
    exceptionResponse.data?.description ||
    "Unknown external error";

  const err = new Boom.Boom(customMessage, {
    statusCode: exceptionResponse.status,
    data: exceptionResponse.data
  });

  return setDataInError(err, exceptionResponse.data);
};

class BaseController {
  // Success Response
  sendSuccess(handler: any, message: string, data?: any): any {
    return handler
      .response({
        success: true,
        message,
        data
      })
      .type("application/json")
      .code(httpStatus.OK);
  }

  // Update Response
  update(handler: any, message: string, updatedData: any): any {
    return handler
      .response({
        success: true,
        message,
        data: updatedData
      })
      .type("application/json")
      .code(httpStatus.OK);
  }

  // Standard Error Handler
  replyError(ex: any, errorMessages: ErrorMessages = new ErrorMessages()): Boom.Boom {
    logger.error(ex);
    const className = this.constructor.name.replace("Controller", "");

    // Safely call addErrorMessage if defined
    if (typeof errorMessages.addErrorMessage === "function") {
      errorMessages.addErrorMessage(httpStatus.INTERNAL_SERVER_ERROR, `${className} Service Error`);
    }

    if (ex?.type === "dynamo") {
      return sendDbError(ex);
    }

    if (ex?.isBoom === true) {
      const customMessage = errorMessages.getErrorMessage?.(ex.output.statusCode);
      if (customMessage) {
        ex.output.payload.message = customMessage.message;
      }
      return setDataInError(ex, customMessage?.details);
    }

    if (ex?.isJoi) {
      return sendError(Boom.badData, ex, ex.details);
    }

    return sendExternalApiErrors(ex, errorMessages);
  }

  // Generic Response Handler
  sendResponse(handler: any, response: any): any {
    return handler.response(response).type("application/json").code(httpStatus.OK);
  }
}

export default BaseController;

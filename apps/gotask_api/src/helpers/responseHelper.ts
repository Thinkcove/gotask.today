import { ResponseToolkit } from "@hapi/hapi";

export const successResponse = (h: ResponseToolkit, data: any, statusCode = 200) => {
  return h.response({ success: true, data }).code(statusCode);
};

export const errorResponse = (
  h: ResponseToolkit,
  message = "Something went wrong",
  statusCode = 500
) => {
  return h.response({ success: false, error: message }).code(statusCode);
};

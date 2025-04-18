export const API: string = "api";

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
} as const;

export type HttpMethod = (typeof API_METHODS)[keyof typeof API_METHODS];

import { Request } from "@hapi/hapi";

class RequestHelper {
  private readonly request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  getParam<T = any>(key: string): T | undefined {
    return this.request.params?.[key] as T;
  }

  getAllParams(): Record<string, any> {
    return this.request.params || {};
  }

  getPayload<T = any>(): T | undefined {
    return this.request.payload as T;
  }

  getQueryString(): string {
    return this.request.url?.search?.substring(1) || "";
  }

  getQueryParam<T = any>(key: string): T | undefined {
    return this.request.query?.[key] as T;
  }
}

export default RequestHelper;

import { Request } from "@hapi/hapi";

class RequestHelper {
  private readonly request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  getRequest(): Request {
    return this.request;
  }

  getParam(key: string): any {
    return this.request.params[key];
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

  getQuery() {
    return this.request.query;
  }
  getUser(): any {
    return this.request.auth && this.request.auth.artifacts && this.request.auth.artifacts.user;
  }
}

export default RequestHelper;

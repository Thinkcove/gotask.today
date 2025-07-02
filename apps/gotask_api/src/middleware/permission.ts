import { Request, ResponseToolkit } from "@hapi/hapi";
import { hasAccess } from "../constants/accessCheck/accessControls";

export function permission(appName: string, action: string, handlerFunc: any) {
  return async (request: Request, h: ResponseToolkit) => {
    const user = request.auth?.artifacts?.user;

    if (!user) {
      return h.response({ error: "Unauthorized" }).code(401);
    }

    const { hasAccess: allowed, restrictedFields } = hasAccess(user, appName, action);

    if (!allowed) {
      return h.response({ error: "Access Denied" }).code(403);
    }

    // Pass restrictedFields to handler so it can enforce field-level access control
    return handlerFunc(request, h, restrictedFields);
  };
}

// permission.ts

import { Request, ResponseToolkit } from "@hapi/hapi";
import { hasAccess } from "../constants/accessCheck/accessControls";

// Middleware with action- and optional field-level access control
export function permission(
  moduleName: string,
  action: string,
  handlerFunc: any,
  field?: string
) {
  return async (request: Request, h: ResponseToolkit) => {
    // Assuming user is attached to request.auth.artifacts.user
    const user = request.auth?.artifacts?.user;

    if (!user) {
      return h.response({ error: "Unauthorized" }).code(401);
    }

    const isAllowed = hasAccess(user, moduleName, action, field);

    if (!isAllowed) {
      return h.response({ error: "Access Denied" }).code(403);
    }

    return handlerFunc(request, h);
  };
}

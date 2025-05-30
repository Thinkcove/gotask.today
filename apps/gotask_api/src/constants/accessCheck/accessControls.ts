import { Request, ResponseToolkit } from "@hapi/hapi";

interface User {
  role?: {
    accessDetails?: {
      name: string;
      application: {
        access: string;
        actions: string[];
        restrictedFields?: {
          [action: string]: string[];
        };
      }[];
    }[];
  };
}

/**
 * Checks if user has access for the given appName and action.
 * Returns an object with:
 * - hasAccess: boolean
 * - restrictedFields: array of field names restricted for this action (empty if none)
 */
export function hasAccess(
  user: User,
  appName: string,
  action: string
): { hasAccess: boolean; restrictedFields: string[] } {
  const accessDetails = user?.role?.accessDetails || [];

  for (const access of accessDetails) {
    for (const app of access.application) {
      if (app.access === appName && app.actions.includes(action)) {
        const restrictedFields =
          (app.restrictedFields && app.restrictedFields[action]) || [];
        return { hasAccess: true, restrictedFields };
      }
    }
  }

  return { hasAccess: false, restrictedFields: [] };
}

/**
 * Middleware generator for permission checking.
 * @param appName - application or module name (e.g. "User Management")
 * @param action - action name (e.g. "EDIT")
 * @param handlerFunc - actual route handler function to run if permission granted
 */
export function permission(
  appName: string,
  action: string,
  handlerFunc: (request: Request, h: ResponseToolkit, restrictedFields: string[]) => any
) {
  return async (request: Request, h: ResponseToolkit) => {
    const user = request.auth?.artifacts?.user;

    if (!user) {
      return h.response({ error: "Unauthorized" }).code(401);
    }

    const { hasAccess: allowed, restrictedFields } = hasAccess(user, appName, action);

    if (!allowed) {
      return h.response({ error: "Access Denied" }).code(403);
    }

    // Pass restrictedFields to the handler for field-level enforcement if needed
    return handlerFunc(request, h, restrictedFields);
  };
}

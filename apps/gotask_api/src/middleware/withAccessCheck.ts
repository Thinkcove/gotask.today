import { Request, ResponseToolkit } from "@hapi/hapi";
import { hasAccess } from "../constants/utils.ts/accessControls";

export function withAccessCheck(appName: string, action: string, handlerFunc: any) {
  return async (request: Request, h: ResponseToolkit) => {
    const user = request.auth?.credentials?.user;
    console.log("Request Credentials:", request.auth.credentials); // Log the full credentials

    if (!user) {
      return h.response({ error: "Unauthorized" }).code(401);
    }

    if (!hasAccess(user, appName, action)) {
      return h.response({ error: "Access Denied" }).code(403);
    }

    return handlerFunc(request, h);
  };
}

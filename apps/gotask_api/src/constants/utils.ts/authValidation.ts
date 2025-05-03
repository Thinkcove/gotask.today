import Boom from "@hapi/boom";
import { Request } from "@hapi/hapi";
import Auth from "./auth";
import { JwtPayload } from "jsonwebtoken";
import logger from "../../common/logger";

export const authValidation = {
  validateUserToken: {
    allowQueryToken: true,
    validate: async (_request: Request, token: string) => {
      try {
        const user = Auth.verify(token) as JwtPayload;
        delete user.iat;
        return {
          isValid: true,
          credentials: { token },
          artifacts: { user }
        };
      } catch (e) {
        logger.error(e);
        return { isValid: false, credentials: { token }, artifacts: null };
      }
    },
    unauthorized: () => Boom.unauthorized("Invalid token")
  }
};

import Joi from "joi";
import { Server } from "@hapi/hapi";
import { createRole, getAllRoles } from "../role/roleController";

// Role routes
export const roleRoutes = (server: Server) => {
  server.route([
    {
      method: "POST",
      path: "/roles",
      options: {
        validate: {
          payload: Joi.object({
            name: Joi.string().required(),
            priority: Joi.number().required(),
            accessIds: Joi.array().items(Joi.string()).optional() // Optional array of access IDs
          })
        }
      },
      handler: createRole
    },
    {
      method: "GET",
      path: "/roles",
      handler: getAllRoles
    }
  ]);
};

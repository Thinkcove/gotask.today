import Hapi from "@hapi/hapi";
import connectDB from "./src/config/database";
import dotenv from "dotenv";
import { accessRoutes } from "./src/modules/access/accessRoutes";
import { roleRoutes } from "./src/modules/role/roleRoutes";

import routes from "./src/routes/route";

dotenv.config();
const init = async () => {
  await connectDB();
  const server = Hapi.server({
    port: process.env.PORT,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"], // Allow all origins
        headers: ["Accept", "Content-Type", "Authorization"], // Allowed headers
        credentials: true // Allow credentials (e.g., cookies, authorization)
      }
    }
  });

  // Register routes
  
  accessRoutes(server);
  roleRoutes(server);
 

  server.route(routes);
  await server.start();
};

init();

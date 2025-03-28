import Hapi from "@hapi/hapi";
import connectDB from "./src/config/database";
import { taskRoutes } from "./src/modules/task/taskRoute";
import { projectRoutes } from "./src/modules/project/projectRoute";
import { userRoutes } from "./src/modules/user/userRoutes";
import dotenv from "dotenv";

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
  taskRoutes(server);
  projectRoutes(server);
  userRoutes(server);

  await server.start();
};

init();

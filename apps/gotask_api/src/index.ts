import Hapi from "@hapi/hapi";
import { connectDB } from "./config/database";
import { PORT } from "./config/dotenv";
import { taskRoutes } from "./modules/task/taskRoute";
import { projectRoutes } from "./modules/project/projectRoute";
import { userRoutes } from "./modules/user/userRoutes";

const init = async () => {
  await connectDB();

  const server = Hapi.server({
    port: PORT,
    host: "localhost",
    routes: {
      cors: {
        origin: ["*"], // Allow all origins
        headers: ["Accept", "Content-Type", "Authorization"], // Allowed headers
        credentials: true, // Allow credentials (e.g., cookies, authorization)
      },
    },
  });

  // Register routes
  taskRoutes(server);
  projectRoutes(server);
  userRoutes(server);

  await server.start();
};

init();

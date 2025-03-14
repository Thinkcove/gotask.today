import Hapi from "@hapi/hapi";
import { connectDB } from "./config/database";
import { PORT } from "./config/dotenv";
import { taskRoutes } from "./modules/task/taskRoute";

const init = async () => {
  await connectDB();

  const server = Hapi.server({
    port: PORT,
    host: "localhost",
  });

  // Register routes
  taskRoutes(server);

  await server.start();
};

init();

import Hapi from "@hapi/hapi";
import connectDB from "./src/config/database";
import dotenv from "dotenv";
import { plugins } from "./src/plugins/plugins";
import routes from "./src/routes/route";
import authStrategy from "./src/constants/utils.ts/authStrategy";
import { authValidation } from "./src/constants/utils.ts/authValidation";

dotenv.config();
const server = Hapi.server({
  port: process.env.PORT,
  host: "localhost",
  routes: {
    cors: {
      origin: ["*"],
      headers: ["Accept", "Content-Type", "Authorization"],
      credentials: true
    }
  }
});

const start = async () => {
  await server.register(plugins);
  server.auth.strategy(
    authStrategy.SIMPLE,
    authStrategy.BEARERSCHEME,
    authValidation.validateUserToken
  );
  server.route(routes);
  await server.start();
};

const init = async () => {
  await connectDB();
  await start();
};

init();

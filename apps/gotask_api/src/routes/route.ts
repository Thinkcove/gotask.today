import { ServerRoute } from "@hapi/hapi";
import * as ProjectRoutes from "../modules/project/projectRoute";
import * as UserRoutes from "../modules/user/userRoutes";
import * as TaskRoutes from "../modules/task/taskRoute";

const routes: ServerRoute[] = [
  ...ProjectRoutes.default,
  ...UserRoutes.default,
  ...TaskRoutes.default
];
export default routes;

import { ServerRoute } from "@hapi/hapi";
import * as ProjectRoutes from "../modules/project/projectRoute";
import * as UserRoutes from "../modules/user/userRoutes";
import * as TaskRoutes from "../modules/task/taskRoute";
import * as AccessRoutes from "../modules/access/accessRoutes";
import * as RoleRoutes from "../modules/role/roleRoutes";

const routes: ServerRoute[] = [
  ...ProjectRoutes.default,
  ...UserRoutes.default,
  ...TaskRoutes.default,
  ...AccessRoutes.default,
  ...RoleRoutes.default
];
export default routes;

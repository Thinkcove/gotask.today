import { ServerRoute } from "@hapi/hapi";
import * as ProjectRoutes from "../modules/project/projectRoute";
import * as UserRoutes from "../modules/user/userRoutes";
import * as TaskRoutes from "../modules/task/taskRoute";
import * as AccessRoutes from "../modules/access/accessRoutes";
import * as RoleRoutes from "../modules/role/roleRoutes";
import * as OrganizationRoutes from "../modules/organization/organizationRoute";
import * as ReportRoutes from "../modules/report/reportRoute";
import * as OtpRoutes from "../modules/otp/otpRoutes";


const routes: ServerRoute[] = [
  ...ProjectRoutes.default,
  ...UserRoutes.default,
  ...TaskRoutes.default,
  ...AccessRoutes.default,
  ...RoleRoutes.default,
  ...OrganizationRoutes.default,
  ...ReportRoutes.default,
  ...OtpRoutes.default,
];
export default routes;

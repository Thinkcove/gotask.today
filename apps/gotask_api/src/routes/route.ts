import { ServerRoute } from "@hapi/hapi";
import * as ProjectRoutes from "../modules/project/projectRoute";
import * as UserRoutes from "../modules/user/userRoutes";
import * as TaskRoutes from "../modules/task/taskRoute";
import * as AccessRoutes from "../modules/access/accessRoutes";
import * as RoleRoutes from "../modules/role/roleRoutes";
import * as OrganizationRoutes from "../modules/organization/organizationRoute";
import * as ReportRoutes from "../modules/report/reportRoute";
import * as OtpRoutes from "../modules/otp/otpRoutes";
import * as UserPreferenceRoutes from "../modules/userPreference/userPreferenceRoutes";
import * as QueryRoutes from "../modules/query/queryRoutes";
import * as AttendanceRoutes from "../modules/attendance/attendanceRoutes";
import * as QueryTaskRoutes from "../modules/queryTask/queryTaskRoutes";
import * as ProjectStoryRoutes from "../modules/projectStory/projectStoryRoutes";
import * as AssetRoutes from "../modules/assets/assetsRoutes";
import * as AssetTagRoutes from "../modules/assetTag/assetTagRoutes";
import * as WorkPlannedReportRoutes from "../modules/planned/plannedRoute";
import * as ProjectGoalRoute from "../modules/projectgoal/projectGoalRoute";
import * as SkillRoutes from "../modules/masters/skills/skillsRoutes";

const routes: ServerRoute[] = [
  ...ProjectRoutes.default,
  ...UserRoutes.default,
  ...TaskRoutes.default,
  ...AccessRoutes.default,
  ...RoleRoutes.default,
  ...OrganizationRoutes.default,
  ...ReportRoutes.default,
  ...OtpRoutes.default,
  ...QueryRoutes.default,
  ...AttendanceRoutes.default,
  ...QueryTaskRoutes.default,
  ...UserPreferenceRoutes.default,
  ...ProjectStoryRoutes.default,
  ...AssetRoutes.default,
  ...AssetTagRoutes.default,
  ...WorkPlannedReportRoutes.default,
  ...ProjectGoalRoute.default,
  ...SkillRoutes.default
];

export default routes;

export const API_PATHS = {
  //taskRoutes
  CREATE_TASK: "/createTask",
  DELETE_TASK: "/deleteTask",
  GET_TASKS: "/getAllTasks",
  GET_TASK_BY_ID: "/getTaskById/{id}",
  UPDATE_TASK: "/updateTask/{id}",
  GET_TASK_BY_PROJECT: "/tasks/grouped-by-project",
  GET_TASK_BY_USER: "/tasks/grouped-by-user",
  GET_TASK_COUNT_BY_STATUS: "/tasks/status-count",
  CREATE_COMMENT: "/task/createComment",
  UPDATE_COMMENT: "/task/updateComment/{id}",
  DELETE_COMMENT: "/task/deleteComment/{id}",
  GET_WORK_PLANNED: "/work-planned/tasks",

  //projectRoutes
  CREATE_PROJECT: "/createProject",
  GET_PROJECTS: "/getAllProjects",
  ASSIGN_USER_TO_PROJECT: "/usertoProject",
  REMOVE_USER_FROM_PROJECT: "/removeUser",
  GET_PROJECT_BY_USERID: "/getProjectbyUserId/{user_id}",
  GET_PROJECT_COUNT_BY_STATUS: "/projectCount",
  GET_PROJECT_BY_ID: "/getProjectById/{id}",
  UPDATE_PROJECT: "/updateProject/{id}",
  GET_USERS_BY_PROJECT_ID: "/getUsersByProjectId/{project_id}",

  //userRoutes
  CREATE_USER: "/createUser",
  GET_USERS: "/getAllUsers",
  GET_USER_BY_ID: "/getUserById/{id}",
  UPDATE_USER: "/updateUser/{id}",
  DELETE_USER: "/deleteUser/{id}",

  //loginRoute
  LOGIN: "/user/login",
  OTP_LOGIN: "/api/user/otp-login",
  SEND_OTP: "/otp/send",
  VERIFY_OTP: "/otp/verify",

  //accessroutes
  CREATE_ACCESS: "/access/create",
  GET_ACCESSES: "/access",
  GET_ACCESS_BY_ID: "/access/{id}",
  UPDATE_ACCESS: "/access/{id}",
  DELETE_ACCESS: "/access/{id}",
  GET_ACCESS_OPTIONS: "/access/options",

  CREATE_ROLE: "/roles",
  GET_ALL_ROLES: "/roles",
  GET_ROLE_BY_ID: "/roles/{id}",
  UPDATE_ROLE: "/roles/{id}",
  DELETE_ROLE: "/roles/{id}",
  DLETE_ROLEACCESS: "/roleAccess",

  //timelogRoutess
  ADD_TIME_SPENT: "/tasklog/{id}",
  UPDATE_ESTIMATED_TIME: "/updatetimelog/{id}",
  GET_TIME_TRACKING_SUMMARY: "/timeSummary/{id}",

  //organizationRoutes
  CREATE_ORGANIZATION: "/createOrganization",
  GET_ORGANIZATIONS: "/getAllOrganizations",
  GET_ORG_BY_ID: "/getOrgById/{id}",
  UPDATE_ORGANIZATION: "/updateOrg/{id}",

  //userreport
  GET_USER_TIME_LOG: "/timeReport",

  //userpreference
  SET_USER_PREFERENCES: "/setPreference",
  GET_USER_PREFERENCES: "/getPreference",

  //leavemodule
  CREATE_LEAVE: "/leave",
  GET_ALL_LEAVES: "/getleave",
  GET_LEAVE_BY_ID: "/getleavebyid/{id}",
  GET_LEAVES: "/getleave",
  UPDATE_LEAVE: "/leave/{id}",
  DELETE_LEAVE: "/leave/{id}",
  GET_LEAVES_BY_USER: "/leave/user",
  GET_LEAVES_BY_DATE_RANGE: "/leave/daterange",
  GET_LEAVES_BY_TYPE: "/leave/type"
};

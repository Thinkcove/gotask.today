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

  //projectRoutes
  CREATE_PROJECT: "/createProject",
  GET_PROJECTS: "/getAllProjects",
  ASSIGN_USER_TO_PROJECT: "/usertoProject",
  REMOVE_USER_FROM_PROJECT: "/removeUser",
  GET_PROJECT_BY_USERID: "/getProjectbyUserId/{user_id}",
  GET_PROJECT_COUNT_BY_STATUS: "/projectCount",
  GET_PROJECT_BY_ID: "/getProjectById/{id}",
  UPDATE_PROJECT: "/updateProject/{id}",

  //userRoutes
  CREATE_USER: "/createUser",
  GET_USERS: "/getAllUsers",
  GET_USER_BY_ID: "/getUserById/{id}",
  UPDATE_USER: "/updateUser/{id}",
  DELETE_USER: "/deleteUser/{id}",
  PROCESS_USER_QUERY: "/api/user/query",

  //loginRoute
  LOGIN: "/user/login",
  OTP_LOGIN: "/api/user/otp-login",
  SEND_OTP: "/otp/send",
  VERIFY_OTP: "/otp/verify",

  //accessroutes
  CREATE_ACCESS: "/access/create", // Path for creating access
  GET_ACCESSES: "/access", // Path for getting all access configurations
  GET_ACCESS_BY_ID: "/access/{id}", // Path for getting access by ID
  UPDATE_ACCESS: "/access/{id}",
  DELETE_ACCESS: "/access/{id}",
  GET_ACCESS_OPTIONS: "/access/options",

  CREATE_ROLE: "/roles", // POST path for creating a role
  GET_ALL_ROLES: "/roles", // GET path for fetching all roles
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

  // Added attendance paths
  CREATE_ATTENDANCE: "/api/attendance",
  UPLOAD_ATTENDANCE: "/api/attendance/upload",
  PROCESS_ATTENDANCE_QUERY: "/api/attendance/query",
  PROCESS_EMPLOYEE_ATTENDANCE_QUERY: "/api/attendance/employee/query",

  // Added query paths (for queryRoutes.ts)
  PROCESS_QUERY: "/api/query",
  GET_QUERY_HISTORY: "/api/query/history",
  CLEAR_QUERY_HISTORY: "/api/query/history/clear",
  DELETE_CONVERSATION: "/api/query/conversation/{id}",

  // Added queryTask path (for queryTaskRoutes.ts)
  PROCESS_TASK_QUERY: "/api/tasks/query",
  CREATE_QUERY_TASK: "/api/tasks/create",
  GET_QUERY_TASKS: "/api/tasks/all",
  GET_QUERY_TASK_BY_ID: "/api/tasks/{id}",
  GET_QUERY_TASKS_BY_PROJECT: "/api/tasks/grouped-by-project",
  GET_QUERY_TASK_BY_USER: "/api/task/{id}",
  GET_QUERY_TASK_COUNT_BY_STATUS: "/api/tasks/status-count",
  UPDATE_QUERY_TASK: "/api/task/{id}",
  CREATE_QUERY_TASK_COMMENT: "/api/task/createcomment",
  UPDATE_QUERY_COMMENT: "/api/task/update/{id}",
  DELETE_QUERY_TASK: "/api/task/delete/{id}",
  ADD_QUERY_TIME_SPEND: "/api/tasklog/{id}"
};

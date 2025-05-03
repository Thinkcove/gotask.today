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

  //loginRoute
  LOGIN: "/user/login",

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
  UPDATE_ORGANIZATION: "/updateOrg/{id}"
};

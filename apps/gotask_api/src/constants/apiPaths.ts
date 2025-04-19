export const API_PATHS = {
  //taskRoutes
  CREATE_TASK: "/createTask",
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
  GET_PROJECT_BY_USERID: "/getProjectbyUserId/{user_id}",

  //userRoutes
  CREATE_USER: "/createUser",
  GET_USERS: "/getAllUsers",
  GET_USER_BY_ID: "/getUserById/{id}",
  UPDATE_USER: "/updateUser/{id}",

  //loginRoute
  LOGIN: "/user/login",

  // Add these new paths
  ADD_TIME_SPENT: "/tasklog/{id}", 
  UPDATE_ESTIMATED_TIME: "/tasks/{id}/update-estimated-time", 
  GET_TIME_TRACKING_SUMMARY: "/tasks/{id}" 
};

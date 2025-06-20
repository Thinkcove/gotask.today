import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import UserController from "./userController";
import { permission } from "../../middleware/permission";
import { ACTIONS, APPLICATIONS } from "../../constants/accessCheck/authorization";
import authStrategy from "../../constants/auth/authStrategy";

const userController = new UserController();
const tags = [API, "User"];
const UserRoutes = [];

const appName = APPLICATIONS.USER;

// Route: Create User
UserRoutes.push({
  path: API_PATHS.CREATE_USER,
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.CREATE, (request: Request, handler: ResponseToolkit) =>
    userController.createUser(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Create a new user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get All Users
UserRoutes.push({
  path: API_PATHS.GET_USERS,
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    userController.getAllUsers(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get all users",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Get User by ID
UserRoutes.push({
  path: API_PATHS.GET_USER_BY_ID,
  method: API_METHODS.GET,
  handler: permission(appName, ACTIONS.VIEW, (request: Request, handler: ResponseToolkit) =>
    userController.getUserById(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Get a user by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Update User
UserRoutes.push({
  path: API_PATHS.UPDATE_USER,
  method: API_METHODS.PUT,
  handler: permission(appName, ACTIONS.UPDATE, (request: Request, handler: ResponseToolkit) =>
    userController.updateUser(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Update user details",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Route: Login User (Public – no access check)
UserRoutes.push({
  path: API_PATHS.LOGIN,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.loginUser(new RequestHelper(request), handler),
  config: {
    notes: "Authenticate user login",
    tags
  }
});

// Route: Delete User
UserRoutes.push({
  path: API_PATHS.DELETE_USER,
  method: API_METHODS.DELETE,
  handler: permission(appName, ACTIONS.DELETE, (request: Request, handler: ResponseToolkit) =>
    userController.deleteUser(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Delete a user by ID",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// route : Get users by Project Id
UserRoutes.push({
  path: API_PATHS.GET_USERS_BY_PROJECT_ID,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.getUsersByProjectId(new RequestHelper(request), handler),
  config: {
    notes: "Get Users by Project ID",
    tags
  }
});

//route for user query
UserRoutes.push({
  path: "/api/user/query",
  method: API_METHODS.POST,
  handler: permission(appName, ACTIONS.READ, (request: Request, handler: ResponseToolkit) =>
    userController.processQuery(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Process user-related query",
    tags,
    auth: { strategy: authStrategy.SIMPLE }
  }
});

UserRoutes.push({
  path: `/skills/{id}`,
  method: API_METHODS.PUT,
  handler: permission(appName, ACTIONS.UPDATE, (request: Request, handler: ResponseToolkit) =>
    userController.updateUserSkills(new RequestHelper(request), handler)
  ),
  config: {
    notes: "Update skills of a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default UserRoutes;

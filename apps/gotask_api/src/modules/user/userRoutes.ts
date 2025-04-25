import { Request, ResponseToolkit } from "@hapi/hapi";
import { API_PATHS } from "../../constants/api/apiPaths";
import { API, API_METHODS } from "../../constants/api/apiMethods";
import RequestHelper from "../../helpers/requestHelper";
import UserController from "./userController";

const userController = new UserController();

const tags = [API, "User"];
const UserRoutes = [];

// Route: Create User
UserRoutes.push({
  path: API_PATHS.CREATE_USER,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.createUser(new RequestHelper(request), handler),
  config: {
    notes: "Create a new user",
    tags
  }
});

// Route: Get All Users
UserRoutes.push({
  path: API_PATHS.GET_USERS,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.getAllUsers(new RequestHelper(request), handler),
  config: {
    notes: "Get all users",
    tags
  }
});

// Route: Get User by ID
UserRoutes.push({
  path: API_PATHS.GET_USER_BY_ID,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.getUserById(new RequestHelper(request), handler),
  config: {
    notes: "Get a user by ID",
    tags
  }
});

// Route: Update User
UserRoutes.push({
  path: API_PATHS.UPDATE_USER,
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.updateUser(new RequestHelper(request), handler),
  config: {
    notes: "Update user details",
    tags
  }
});

// Route: Login User
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

// Route: Request OTP
UserRoutes.push({
  path: API_PATHS.REQUEST_OTP,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.requestOTPLayer(new RequestHelper(request), handler),
  config: {
    notes: "Send OTP to user email",
    tags
  }
});

//Route: Verify OTP
UserRoutes.push({
  path: API_PATHS.VERIFY_OTP,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.verifyOTPLayer(new RequestHelper(request), handler),
  config: {
    notes: "Verify OTP entered by user",
    tags
  }
});

export default UserRoutes;

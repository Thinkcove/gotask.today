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
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.addUserSkills(new RequestHelper(request), handler),
  config: {
    notes: "Update skills of a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

UserRoutes.push({
  path: `/skills/{id}/{skill_id}`,
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.updateUserSkill(new RequestHelper(request), handler),
  config: {
    notes: "Update a specific skill of a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

UserRoutes.push({
  path: `/skills/{id}/{skill_id}`,
  method: API_METHODS.DELETE,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.deleteUserSkill(new RequestHelper(request), handler),
  config: {
    notes: "Delete a specific skill from a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Certificate Routes

// Get all certificates of a user
UserRoutes.push({
  path: `/certificates/{id}`,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.getUserCertificates(new RequestHelper(request), handler),
  config: {
    notes: "Get all certificates of a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Add certificate(s) to a user
UserRoutes.push({
  path: `/certificates/{id}`,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.addUserCertificates(new RequestHelper(request), handler),
  config: {
    notes: "Add certificate(s) to a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Update a specific certificate of a user
UserRoutes.push({
  path: `/certificates/{id}/{certificate_id}`,
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.updateUserCertificate(new RequestHelper(request), handler),
  config: {
    notes: "Update a specific certificate of a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Delete a specific certificate from a user
UserRoutes.push({
  path: `/certificates/{id}/{certificate_id}`,
  method: API_METHODS.DELETE,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.deleteUserCertificate(new RequestHelper(request), handler),
  config: {
    notes: "Delete a specific certificate from a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Increment History Routes

// Get all increment records
UserRoutes.push({
  path: `/increments/{id}`,
  method: API_METHODS.GET,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.getUserIncrements(new RequestHelper(request), handler),
  config: {
    notes: "Get all increment history of a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Add increment record
UserRoutes.push({
  path: `/increments/{id}`,
  method: API_METHODS.POST,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.addUserIncrement(new RequestHelper(request), handler),
  config: {
    notes: "Add a new increment record to a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Update specific increment record by index
UserRoutes.push({
  path: `/increments/{id}/{index}`,
  method: API_METHODS.PUT,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.updateUserIncrement(new RequestHelper(request), handler),
  config: {
    notes: "Update a specific increment record of a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

// Delete specific increment record by index
UserRoutes.push({
  path: `/increments/{id}/{index}`,
  method: API_METHODS.DELETE,
  handler: (request: Request, handler: ResponseToolkit) =>
    userController.deleteUserIncrement(new RequestHelper(request), handler),
  config: {
    notes: "Delete a specific increment record of a user",
    tags,
    auth: {
      strategy: authStrategy.SIMPLE
    }
  }
});

export default UserRoutes;

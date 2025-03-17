import { Request, ResponseToolkit } from "@hapi/hapi";
import { UserService } from "./userService";
import { errorResponse, successResponse } from "../../helpers/responseHelper";

// Create a new User
export const createUser = async (request: Request, h: ResponseToolkit) => {
  try {
    const userData = request.payload as any;
    if (!userData.name || !userData.user_id || !userData.role) {
      return errorResponse(h, "Missing required fields", 400);
    }
    const newUser = await UserService.createUser(userData);
    return successResponse(h, newUser, 201);
  } catch (error) {
    return errorResponse(h, "Failed to create user");
  }
};

// Get All Users
export const getAllUsers = async (_request: Request, h: ResponseToolkit) => {
  try {
    const users = await UserService.getAllUsers();
    return successResponse(h, users);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve users");
  }
};

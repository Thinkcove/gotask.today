import { Request, ResponseToolkit } from "@hapi/hapi";
import { UserService } from "./userService";
import { errorResponse, successResponse } from "../../helpers/responseHelper";
import { IUser } from "../../domain/model/user";
import jwt from "jsonwebtoken";
import { comparePassword } from "../../constants/utils.ts/common";

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

// Get a User by id
export const getUserById = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const user = await UserService.getUserById(id);
    if (!user) return errorResponse(h, "User not found", 404);
    return successResponse(h, user);
  } catch (error) {
    return errorResponse(h, "Failed to retrieve user");
  }
};

// Update User details by id
export const updateUser = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params; // Extract ID from the route
    const updatedData = request.payload as Partial<IUser>; // Allow updating any field
    const updatedUser = await UserService.updateUser(id, updatedData);
    if (!updatedUser) return errorResponse(h, "User not found", 404);
    return successResponse(h, updatedUser);
  } catch (error) {
    return errorResponse(h, "Failed to update user details");
  }
};

// Login API
export const loginUser = async (request: Request, h: ResponseToolkit) => {
  try {
    const { user_id, password } = request.payload as { user_id: string; password: string };
    // Fetch user by email
    const user = await UserService.getUserByEmail(user_id);
    if (!user) return errorResponse(h, "User not found", 404);
    // Compare passwords using the separate function
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return errorResponse(h, "Invalid credentials", 401);
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, user_id: user.user_id, role: user.role },
      process.env.AUTH_KEY as string,
      {
        expiresIn: "1h",
      },
    );
    return successResponse(h, { token, user }, 200);
  } catch (error) {
    return errorResponse(h, "Failed to login");
  }
};

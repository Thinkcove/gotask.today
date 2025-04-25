import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { comparePassword } from "../../constants/utils.ts/common";
import jwt from "jsonwebtoken";
import {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser
} from "./userService";
import { getRoleByIdService } from "../role/roleService";

class UserController extends BaseController {
  // Create a new user
  async createUser(requestHelper: RequestHelper, handler: any) {
    try {
      const userData = requestHelper.getPayload();
      const { name, user_id, roleId, password, status } = userData;

      if (!name || !user_id || !roleId || !password || typeof status === "undefined") {
        throw new Error("Missing required fields: name, user_id, roleId, password, status");
      }

      // Call the service to create the user
      const newUser = await createUser(userData);

      return this.sendResponse(handler, newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return this.replyError(error);
    }
  }

  // Get all users
  async getAllUsers(_requestHelper: RequestHelper, handler: any) {
    try {
      const users = await getAllUsers();
      return this.sendResponse(handler, users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return this.replyError(error);
    }
  }

  // Get user by id
  async getUserById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = await getUserById(id);
      if (!user) throw new Error("User not found");
      return this.sendResponse(handler, user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return this.replyError(error);
    }
  }

  // Update user
  async updateUser(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updatedData = requestHelper.getPayload();
      const updatedUser = await updateUser(id, updatedData);

      if (!updatedUser) throw new Error("User not found");
      return this.sendResponse(handler, updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return this.replyError(error);
    }
  }

  //delet user
  async deleteUser(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const deletedUser = await deleteUser(id);

      if (!deletedUser) throw new Error("User not found");
      return this.sendResponse(handler, {
        success: true,
        message: "User deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return this.replyError(error);
    }
  }

  // User login
  async loginUser(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id, password } = requestHelper.getPayload();

      if (!user_id || !password) {
        return this.sendResponse(handler, {
          success: false,
          error: "Missing required fields: user_id and password"
        });
      }

      const { success, data: user, message } = await getUserByEmail(user_id, true);

      if (!success || !user) {
        return this.sendResponse(handler, {
          success: false,
          error: message || "User not found"
        });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return this.sendResponse(handler, {
          success: false,
          error: "Invalid credentials"
        });
      }

      // Fetch full role with access details using UUID
      const roleId = user.roleId?.id?.toString();

      if (!roleId) {
        return this.sendResponse(handler, {
          success: false,
          error: "Role ID not found for this user"
        });
      }

      const roleResult = await getRoleByIdService(roleId);

      if (!roleResult.success || !roleResult.data) {
        return this.sendResponse(handler, {
          success: false,
          error: roleResult.message || "Failed to fetch role details"
        });
      }

      const enrichedRole = roleResult.data;

      // Generate JWT with full role
      const token = jwt.sign(
        {
          id: user.id,
          user_id: user.user_id,
          role: enrichedRole
        },
        process.env.AUTH_KEY as string,
        { expiresIn: "1h" }
      );

      // Clean user object before returning
      const { ...sanitizedUser } = user.toObject();
      sanitizedUser.role = enrichedRole;

      return this.sendResponse(handler, {
        success: true,
        data: {
          token,
          user: sanitizedUser
        }
      });
    } catch (error: any) {
      console.error("Login error:", error);
      return this.sendResponse(handler, {
        success: false,
        error: error.message || "Failed to login"
      });
    }
  }
}

export default UserController;

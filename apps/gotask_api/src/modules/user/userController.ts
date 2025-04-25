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
import UserMessages from "../../constants/apiMessages/userMessage"; // Import user messages

class UserController extends BaseController {
  // Create a new user
  async createUser(requestHelper: RequestHelper, handler: any) {
    try {
      const userData = requestHelper.getPayload();
      const { name, user_id, roleId, password, status } = userData;

      if (!name || !user_id || !roleId || !password || typeof status === "undefined") {
        throw new Error(UserMessages.CREATE.MISSING_FIELDS); // Use the message constants
      }

      // Call the service to create the user
      const newUser = await createUser(userData);

      return this.sendResponse(handler, newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return this.replyError(new Error(UserMessages.CREATE.FAILED)); // Use the message constants
    }
  }

  // Get all users
  async getAllUsers(_requestHelper: RequestHelper, handler: any) {
    try {
      const users = await getAllUsers();
      return this.sendResponse(handler, users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return this.replyError(new Error(UserMessages.FETCH.FAILED_ALL)); // Use the message constants
    }
  }

  // Get user by id
  async getUserById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = await getUserById(id);
      if (!user) throw new Error(UserMessages.FETCH.NOT_FOUND); // Use the message constants
      return this.sendResponse(handler, user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return this.replyError(new Error(UserMessages.FETCH.FAILED_BY_ID)); // Use the message constants
    }
  }

  // Update user
  async updateUser(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updatedData = requestHelper.getPayload();
      const updatedUser = await updateUser(id, updatedData);

      if (!updatedUser) throw new Error(UserMessages.FETCH.NOT_FOUND); // Use the message constants
      return this.sendResponse(handler, updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return this.replyError(new Error(UserMessages.UPDATE.FAILED)); // Use the message constants
    }
  }

  // Delete user
  async deleteUser(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const deletedUser = await deleteUser(id);

      if (!deletedUser) throw new Error(UserMessages.DELETE.NOT_FOUND); // Use the message constants
      return this.sendResponse(handler, {
        success: true,
        message: UserMessages.DELETE.SUCCESS // Use the message constants
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return this.replyError(new Error(UserMessages.DELETE.FAILED)); // Use the message constants
    }
  }

  // User login
  async loginUser(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id, password } = requestHelper.getPayload();

      if (!user_id || !password) {
        return this.sendResponse(handler, {
          success: false,
          error: UserMessages.LOGIN.MISSING_FIELDS // Use the message constants
        });
      }

      const { success, data: user, message } = await getUserByEmail(user_id, true);

      if (!success || !user) {
        return this.sendResponse(handler, {
          success: false,
          error: message || UserMessages.LOGIN.USER_NOT_FOUND // Use the message constants
        });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return this.sendResponse(handler, {
          success: false,
          error: UserMessages.LOGIN.INVALID_CREDENTIALS // Use the message constants
        });
      }

      // Fetch full role with access details using UUID
      const roleId = user.roleId?.id?.toString();

      if (!roleId) {
        return this.sendResponse(handler, {
          success: false,
          error: UserMessages.LOGIN.ROLE_NOT_FOUND // Use the message constants
        });
      }

      const roleResult = await getRoleByIdService(roleId);

      if (!roleResult.success || !roleResult.data) {
        return this.sendResponse(handler, {
          success: false,
          error: roleResult.message || UserMessages.LOGIN.ROLE_FETCH_FAILED // Use the message constants
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
        error: error.message || UserMessages.LOGIN.INVALID_CREDENTIALS // Use the message constants
      });
    }
  }
}

export default UserController;

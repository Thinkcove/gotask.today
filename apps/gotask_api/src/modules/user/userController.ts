import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { comparePassword } from "../../constants/utils.ts/common";
import jwt from "jsonwebtoken";
import { createUser, getAllUsers, getUserByEmail, getUserById, updateUser } from "./userService";
import { Access } from "../../domain/model/access";

class UserController extends BaseController {
  // Create a new user
  async createUser(requestHelper: RequestHelper, handler: any) {
    try {
      const userData = requestHelper.getPayload();
      const { name, user_id, role } = userData;

      if (!name || !user_id || !role) {
        throw new Error("Missing required fields");
      }

      const newUser = await createUser(userData);
      return this.sendResponse(handler, newUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get all users
  async getAllUsers(_requestHelper: RequestHelper, handler: any) {
    try {
      const users = await getAllUsers();
      return this.sendResponse(handler, users);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Get user by id
  async getUserById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = await getUserById(id); // Fetch user with populated data
      if (!user) throw new Error("User not found");
      return this.sendResponse(handler, user);
    } catch (error) {
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
      return this.replyError(error);
    }
  }

  // User login
  async loginUser(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id, password } = requestHelper.getPayload();
      
      // Step 1: Get user details by user_id and populate the 'role' field
      const { success, data: user, message } = await getUserByEmail(user_id, true); // Passing true to populate role

      if (!success || !user) {
        return this.sendResponse(handler, {
          success: false,
          error: message || "User not found"
        });
      }
      
      // Step 2: Check if the password matches
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return this.sendResponse(handler, {
          success: false,
          error: "Invalid credentials"
        });
      }

      // Step 3: Get role and access details
      const role = user.role; // Now role should be populated, not just an ObjectId
      
      if (!role) {
        return this.sendResponse(handler, {
          success: false,
          error: "Role not found for the user"
        });
      }

      // Step 4: Fetch access details by UUIDs stored in role.access
      const accessRecords = await Access.find({
        id: { $in: role.access } // Accessing the populated role's access
      }).lean(); // Use lean() to get plain JavaScript objects

      // Create an enhanced role with access details
      const roleWithAccess = {
        ...role, // Convert role to plain object if needed
        accessDetails: accessRecords.map((access: any) => ({
          id: access.id,
          name: access.name,
          application: access.application,
        })),
      };

      // Step 5: Generate JWT token with user and role access
      const token = jwt.sign(
        { id: user.id, user_id: user.user_id, role: roleWithAccess },
        process.env.AUTH_KEY as string,
        { expiresIn: "1h" }
      );

      // Step 6: Sanitize the user data (remove password)
      const sanitizedUser = {
        ...user.toObject(), // Convert user to plain object
        password: undefined // Remove password from the final response
      };

      // Step 7: Return the response with the token and sanitized user data
      return this.sendResponse(handler, {
        success: true,
        data: {
          token,
          user: sanitizedUser // Send user data with full role and access details
        }
      });
    } catch (error: any) {
      return this.sendResponse(handler, {
        success: false,
        error: error.message || "Failed to login"
      });
    }
  }
}

export default UserController;

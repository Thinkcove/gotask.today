import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { comparePassword } from "../../constants/utils.ts/common";
import jwt from "jsonwebtoken";
import { createUser, getAllUsers, getUserByEmail, getUserById, updateUser } from "./userService";
import { Access } from "../../domain/model/access";
import { Role } from "../../domain/model/role"; // Import the Role model

class UserController extends BaseController {
  // Create a new user
  async createUser(requestHelper: RequestHelper, handler: any) {
    try {
      const userData = requestHelper.getPayload(); // Correctly getting the payload from the request
      const { name, user_id, roleId, password, status } = userData; // Use roleId instead of role

      if (!name || !user_id || !roleId || !password || typeof status === 'undefined') {
        throw new Error("Missing required fields: name, user_id, roleId, password, status");
      }

      // Call the service to create the user
      const newUser = await createUser(userData);

      return this.sendResponse(handler, newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return this.replyError(error); // Use this for standardized error responses
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
      const user = await getUserById(id); // Fetch user by ID
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
      const updatedData = requestHelper.getPayload(); // Get payload from request
      const updatedUser = await updateUser(id, updatedData);

      if (!updatedUser) throw new Error("User not found");
      return this.sendResponse(handler, updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return this.replyError(error);
    }
  }

  // User login
  async loginUser(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id, password } = requestHelper.getPayload(); // Get login credentials

      if (!user_id || !password) {
        return this.sendResponse(handler, {
          success: false,
          error: "Missing required fields: user_id and password"
        });
      }

      // Step 1: Fetch user details by user_id, include roleId
      const { success, data: user, message } = await getUserByEmail(user_id, true); // Fetch with populated roleId

      if (!success || !user) {
        return this.sendResponse(handler, {
          success: false,
          error: message || "User not found"
        });
      }

      // Step 2: Compare password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return this.sendResponse(handler, {
          success: false,
          error: "Invalid credentials"
        });
      }

      // Step 3: Fetch the role using roleId (this replaces accessing the role directly)
      const role = await Role.findById(user.roleId); // Fetch the Role by ID (roleId is now used)

      if (!role) {
        return this.sendResponse(handler, {
          success: false,
          error: "Role not found for the user"
        });
      }

      // Step 4: Fetch access details for the role
      const accessRecords = await Access.find({
        id: { $in: role.access } // Access the populated access details from role
      }).lean(); // Convert to plain JavaScript object

      // Enhance role with access details
      const roleWithAccess = {
        ...role.toObject(), // Convert the role to a plain object
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

      // Step 6: Sanitize the user object by removing password
      const sanitizedUser = {
        ...user.toObject(),
        password: undefined, // Ensure password is excluded
      };

      // Step 7: Send response with token and user data
      return this.sendResponse(handler, {
        success: true,
        data: {
          token,
          user: sanitizedUser, // Send full user data with enhanced role and access
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

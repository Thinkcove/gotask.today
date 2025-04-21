import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { comparePassword } from "../../constants/utils.ts/common";
import jwt from "jsonwebtoken";
import { createUser, getAllUsers, getUserByEmail, getUserById, updateUser } from "./userService";

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

  // Get user by ID
  async getUserById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = await getUserById(id);
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

// Login user
// Login user
async loginUser(requestHelper: RequestHelper, handler: any) {
  try {
    const { user_id, password } = requestHelper.getPayload();

    const { success, data: user, message } = await getUserByEmail(user_id);
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

    // Step 1: Ensure that the user role includes access details
    await user.populate({
      path: "role",
      populate: {
        path: "access", // Populate the access array
        model: "Access" // Ensure it's referring to the correct Access model
      }
    });

    const token = jwt.sign(
      { id: user.id, user_id: user.user_id, role: user.role },
      process.env.AUTH_KEY as string,
      { expiresIn: "1h" }
    );

    // Sanitize the user data to remove the password
    const sanitizedUser = {
      ...user.toObject?.(), // safely convert Mongoose doc to plain object
      password: undefined // remove password field
    };

    // Step 2: Return the role with access details inside the user data
    return this.sendResponse(handler, {
      success: true,
      data: {
        token,
        user: sanitizedUser // Send sanitized user without password, including role with access
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

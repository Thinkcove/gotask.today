import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import { comparePassword } from "../../constants/utils.ts/common";
import jwt from "jsonwebtoken";
import {
  createUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  requestOTP,
  updateUser,
  verifyOTP
} from "./userService";
import UserMessages from "../../constants/apiMessages/userMessage";

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

      const token = jwt.sign(
        { id: user.id, user_id: user.user_id, role: user.role },
        process.env.AUTH_KEY as string,
        { expiresIn: "1h" }
      );

      return this.sendResponse(handler, {
        success: true,
        data: {
          token,
          user
        }
      });
    } catch (error: any) {
      return this.sendResponse(handler, {
        success: false,
        error: error.message || "Failed to login"
      });
    }
  }

  // Request OTP
  async requestOTPLayer(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id } = requestHelper.getPayload();
      const result = await requestOTP(user_id); // logic in service
      return this.sendResponse(handler, result);
    } catch (error: any) {
      return this.sendResponse(handler, {
        success: false,
        error: error.message || UserMessages.OTP.SEND_FAILED
      });
    }
  }

  // Verify OTP and login
  async verifyOTPLayer(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id, otp } = requestHelper.getPayload();
      const result = await verifyOTP(user_id, otp); // logic in service
      return this.sendResponse(handler, result);
    } catch (error: any) {
      return this.sendResponse(handler, {
        success: false,
        error: error.message || UserMessages.OTP.VERIFY_FAILED
      });
    }
  }
}

export default UserController;

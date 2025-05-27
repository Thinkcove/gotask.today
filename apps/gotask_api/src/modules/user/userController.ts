import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import jwt from "jsonwebtoken";
import userService from "./userService";
import { getRoleByIdService } from "../role/roleService";
import UserMessages from "../../constants/apiMessages/userMessage";
import { comparePassword } from "../../constants/utils/common";

class UserController extends BaseController {
  async createUser(requestHelper: RequestHelper, handler: any) {
    try {
      const userData = requestHelper.getPayload();
      const { name, user_id, roleId, password, status } = userData;
      if (!name || !user_id || !roleId || !password || typeof status === "undefined") {
        throw new Error(UserMessages.CREATE.MISSING_FIELDS);
      }
      const newUser = await userService.createUser(userData);
      return this.sendResponse(handler, newUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getAllUsers(_requestHelper: RequestHelper, handler: any) {
    try {
      const users = await userService.getAllUsers();
      return this.sendResponse(handler, users);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async getUserById(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const user = await userService.getUserById(id);
      return this.sendResponse(handler, user);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async updateUser(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const updatedData = requestHelper.getPayload();
      const updatedUser = await userService.updateUser(id, updatedData);
      return this.sendResponse(handler, updatedUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async deleteUser(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const deletedUser = await userService.deleteUser(id);
      return this.sendResponse(handler, deletedUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async loginUser(requestHelper: RequestHelper, handler: any) {
    try {
      const { user_id, password } = requestHelper.getPayload();
      if (!user_id || !password) {
        return this.sendResponse(handler, {
          success: false,
          error: UserMessages.LOGIN.MISSING_FIELDS
        });
      }
      const { success, data: user, message } = await userService.getUserByEmail(user_id, true);
      if (!success || !user) {
        return this.sendResponse(handler, {
          success: false,
          error: message || UserMessages.LOGIN.USER_NOT_FOUND
        });
      }
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return this.sendResponse(handler, {
          success: false,
          error: UserMessages.LOGIN.INVALID_CREDENTIALS
        });
      }
      const roleId = user.roleId?.id?.toString();
      if (!roleId) {
        return this.sendResponse(handler, {
          success: false,
          error: UserMessages.LOGIN.ROLE_NOT_FOUND
        });
      }
      const roleResult = await getRoleByIdService(roleId);
      if (!roleResult.success || !roleResult.data) {
        return this.sendResponse(handler, {
          success: false,
          error: roleResult.message || UserMessages.LOGIN.ROLE_FETCH_FAILED
        });
      }
      const enrichedRole = roleResult.data;
      const token = jwt.sign(
        {
          id: user.id,
          user_id: user.user_id,
          role: enrichedRole
        },
        process.env.AUTH_KEY as string,
        { expiresIn: "1h" }
      );

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
        error: error.message || UserMessages.LOGIN.INVALID_CREDENTIALS
      });
    }
  }

  async processQuery(requestHelper: RequestHelper, handler: any) {
    try {
      const payload = requestHelper.getPayload();
      const query = payload?.query;
      const parsedQuery = payload?.parsedQuery as Record<string, any>;

      if (!query || !parsedQuery) {
        return this.sendResponse(handler, {
          success: false,
          message: UserMessages.QUERY.MISSING_FIELDS
        });
      }

      const result = await userService.processQuery(query, parsedQuery);
      return this.sendResponse(handler, result);
    } catch (error: any) {
      console.error("Process query error:", error);
      return this.sendResponse(handler, {
        success: false,
        message: error.message || UserMessages.QUERY.FAILED
      });
    }
  }
}

export default UserController;

import RequestHelper from "../../helpers/requestHelper";
import BaseController from "../../common/baseController";
import jwt from "jsonwebtoken";
import { getRoleByIdService } from "../role/roleService";
import UserMessages from "../../constants/apiMessages/userMessage";
import userService from "./userService";

class UserController extends BaseController {
  async createUser(requestHelper: RequestHelper, handler: any) {
    try {
      const userData = requestHelper.getPayload();
      const { name, user_id, roleId, status } = userData;
      if (!name || !user_id || !roleId || typeof status === "undefined") {
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
      const { user_id } = requestHelper.getPayload();
      if (!user_id) {
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

  // controllers/userController.ts

  async getUsersByProjectId(requestHelper: RequestHelper, handler: any) {
    try {
      const projectId = requestHelper.getParam("project_id");
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      const response = await userService.getUsersByProjectId(projectId);
      return this.sendResponse(handler, response);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async addUserSkills(requestHelper: RequestHelper, handler: any) {
    try {
      const id = requestHelper.getParam("id");
      const payload = requestHelper.getPayload();
      const skills = payload.skills;

      if (!Array.isArray(skills) || skills.length === 0) {
        throw new Error("Skills payload is required and must be an array.");
      }

      const updatedUser = await userService.addSkills(id, skills);
      return this.sendResponse(handler, updatedUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async updateUserSkill(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("id");
      const skillId = requestHelper.getParam("skill_id");
      const updatedSkill = requestHelper.getPayload();

      const result = await userService.updateSkill(userId, skillId, updatedSkill);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async deleteUserSkill(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("id");
      const skillId = requestHelper.getParam("skill_id");

      const deletedUser = await userService.deleteSkill(userId, skillId);
      return this.sendResponse(handler, deletedUser);
    } catch (error) {
      return this.replyError(error);
    }
  }
  // Certificates

  async getUserCertificates(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("id");
      const result = await userService.getCertificates(userId);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async addUserCertificates(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("id");
      const payload = requestHelper.getPayload();
      const certificates = payload.certificates;

      if (!Array.isArray(certificates) || certificates.length === 0) {
        throw new Error("Certificates payload must be a non-empty array.");
      }

      const sanitizedCertificates = certificates.map((cert: any) => {
        if ("certificate_id" in cert) delete cert.certificate_id;
        if ("_id" in cert) delete cert._id;
        return cert;
      });

      const updatedUser = await userService.addCertificates(userId, sanitizedCertificates);
      return this.sendResponse(handler, updatedUser);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async updateUserCertificate(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("id");
      const certificateId = requestHelper.getParam("certificate_id");
      const updatedCertificate = requestHelper.getPayload();

      const result = await userService.updateCertificate(userId, certificateId, updatedCertificate);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async deleteUserCertificate(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("id");
      const certificateId = requestHelper.getParam("certificate_id");

      const result = await userService.deleteCertificate(userId, certificateId);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  // Increment History

  async getUserIncrements(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("id");
      const result = await userService.getIncrementHistory(userId);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async addUserIncrement(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("id");
      const payload = requestHelper.getPayload(); // raw body

      if (!payload || !payload.date || payload.ctc == null) {
        throw new Error("Increment object with 'date' and 'ctc' is required.");
      }

      const result = await userService.addIncrement(userId, payload);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async updateUserIncrement(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("id");
      const index = parseInt(requestHelper.getParam("index"));
      const updateData = requestHelper.getPayload();

      if (!updateData || updateData.ctc == null || !updateData.date) {
        throw new Error("Updated increment object must include date and ctc.");
      }

      const result = await userService.updateIncrement(userId, index, updateData);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }

  async deleteUserIncrement(requestHelper: RequestHelper, handler: any) {
    try {
      const userId = requestHelper.getParam("id");
      const index = parseInt(requestHelper.getParam("index"));

      const result = await userService.deleteIncrement(userId, index);
      return this.sendResponse(handler, result);
    } catch (error) {
      return this.replyError(error);
    }
  }
}

export default UserController;

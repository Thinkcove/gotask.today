import UserMessages from "../../constants/apiMessages/userMessage";
import { findOrganizationsByIds } from "../../domain/interface/organization/organizationInterface";
import {
  createNewUser,
  deleteUserId,
  findAllUsers,
  findProjectsByIds,
  findUser,
  updateUserById,
  findUsersByProjectId
} from "../../domain/interface/user/userInterface";
import { IUser, User } from "../../domain/model/user/user";
import { Role } from "../../domain/model/role/role";
import { getRoleByIdService } from "../role/roleService";
import { findRoleByIds } from "../../domain/interface/role/roleInterface";
import { Organization } from "../../domain/model/organization/organization";
import { getAssetByUserId, getIssuesByUserId } from "../../domain/interface/assetTag/assetTag";
import { getById } from "../../domain/interface/asset/asset";
import { IAsset } from "../../domain/model/asset/asset";
import { ISkill } from "../../domain/model/user/skills";
import { ICertificate } from "../../domain/model/user/certificate";

class userService {
  // CREATE USER
  async createUser(userData: IUser): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      if (!userData || !userData.roleId) {
        return {
          success: false,
          message: UserMessages.CREATE.REQUIRED
        };
      }

      const roleExists = await Role.findById(userData.roleId);
      if (!roleExists) {
        return {
          success: false,
          message: UserMessages.CREATE.ROLE_INVALID
        };
      }

      const newUser = await createNewUser(userData);

      if (userData.organization && userData.organization.length > 0) {
        await Organization.updateMany(
          { id: { $in: userData.organization } },
          { $addToSet: { users: newUser.id } }
        );
      }

      const populatedUser = await newUser.populate("roleId", "name");

      return {
        success: true,
        data: populatedUser,
        message: UserMessages.CREATE.SUCCESS
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || UserMessages.CREATE.FAILED
      };
    }
  }

  // GET ALL USERS
  async getAllUsers(): Promise<{ success: boolean; data?: IUser[]; message?: string }> {
    try {
      const users = await findAllUsers();

      const allRoleIds = Array.from(
        new Set(users.map((user) => user.roleId?.toString()).filter(Boolean))
      );

      const allOrganizationIds = Array.from(
        new Set(users.flatMap((user) => user.organization?.filter((id) => id !== undefined) || []))
      );

      const [roles, organizations] = await Promise.all([
        findRoleByIds(allRoleIds),
        findOrganizationsByIds(allOrganizationIds)
      ]);

      const roleMap = new Map(roles.map((role: any) => [role._id.toString(), role]));

      const organizationMap = new Map(
        organizations.map((organization: any) => [organization.id, organization])
      );

      const enrichedUsers = users.map((user) => {
        const userObj = user.toObject();
        const userOrganizations = (user.organization || [])
          .map((id: string) => organizationMap.get(id))
          .filter(Boolean);

        const userRole = roleMap.get(user.roleId?.toString() || "");
        return {
          ...userObj,
          organizations: userOrganizations,
          role: userRole || null
        };
      });

      enrichedUsers.sort((a, b) => a.name.localeCompare(b.name));

      return {
        success: true,
        data: enrichedUsers
      };
    } catch (error: any) {
      console.error("getAllUsers error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch all users"
      };
    }
  }

  // GET USER BY ID
  async getUserById(id: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const user = await User.findOne({ id }).populate("roleId");

      if (!user) {
        return {
          success: false,
          message: UserMessages.FETCH.NOT_FOUND
        };
      }

      const roleId = user.roleId?.id?.toString();
      if (!roleId) {
        return {
          success: false,
          message: UserMessages.FETCH.ROLE_NOT_FOUND
        };
      }

      const roleResult = await getRoleByIdService(roleId);
      if (!roleResult.success || !roleResult.data) {
        return {
          success: false,
          message: roleResult.message || UserMessages.FETCH.FETCH_ROLE_FAILED
        };
      }

      const enrichedRole = roleResult.data;

      const userObj = user.toObject() as any;

      const projectIds = (userObj.projects || []).filter(
        (id: string | undefined) => id !== undefined
      );

      let projectDetails = [];
      if (projectIds.length > 0) {
        const projects = await findProjectsByIds(projectIds);
        const projectMap = new Map(projects.map((project: any) => [project.id, project]));
        projectDetails = projectIds.map((id: string) => projectMap.get(id)).filter(Boolean);
      }

      const orgIds = (userObj.organization || []).filter(
        (id: string | undefined) => id !== undefined
      );
      let orgDetails = [];
      if (orgIds.length > 0) {
        const organizations = await findOrganizationsByIds(orgIds);
        const organizationMap = new Map(organizations.map((org: any) => [org.id, org]));
        orgDetails = orgIds.map((id: string) => organizationMap.get(id)).filter(Boolean);
      }

      const userAsset = await getAssetByUserId(id);
      let assetData: IAsset[] = [];

      const allIssuesNested = await Promise.all(
        userAsset.map((tag) => getIssuesByUserId(tag.userId, tag.assetId))
      );
      const allIssues = allIssuesNested.flat();
      const issueCount = allIssues.length;

      if (userAsset && Array.isArray(userAsset)) {
        const assetPromises = userAsset.map((ua) => getById(ua.assetId));
        const assetResults = await Promise.all(assetPromises);
        // Flatten the array and filter out null/undefined values
        assetData = assetResults
          .filter((result): result is IAsset[] => result !== null && result !== undefined)
          .flat();
      }

      userObj.role = enrichedRole;
      userObj.projectDetails = projectDetails;
      userObj.orgDetails = orgDetails;
      // userObj.assetDetails = assetData ? assetData.toObject?.() : null;
      userObj.assetDetails = assetData.map((asset) => asset?.toObject?.() || asset);
      userObj.issuesCount = issueCount;
      return {
        success: true,
        data: userObj
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || UserMessages.FETCH.FAILED_BY_ID
      };
    }
  }

  // UPDATE USER
  async updateUser(
    id: string,
    updateData: Partial<IUser>
  ): Promise<{ success: boolean; data?: IUser | null; message?: string }> {
    try {
      if (updateData.roleId) {
        const roleExists = await Role.findById(updateData.roleId);
        if (!roleExists) {
          return {
            success: false,
            message: UserMessages.UPDATE.ROLE_INVALID
          };
        }
      }

      const updatedUser = await updateUserById(id, updateData);
      if (!updatedUser) {
        return {
          success: false,
          message: UserMessages.FETCH.NOT_FOUND
        };
      }

      if (updateData.organization && updateData.organization.length > 0) {
        await Organization.updateMany(
          { id: { $in: updateData.organization } },
          { $addToSet: { users: updatedUser.id } }
        );
      }

      return {
        success: true,
        data: updatedUser,
        message: UserMessages.UPDATE.SUCCESS
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || UserMessages.UPDATE.FAILED
      };
    }
  }

  // DELETE USER
  async deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const user = await findUser(id);
      if (!user) {
        return {
          success: false,
          message: UserMessages.FETCH.NOT_FOUND
        };
      }
      await deleteUserId(id);
      return {
        success: true,
        message: UserMessages.DELETE.SUCCESS
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || UserMessages.DELETE.FAILED
      };
    }
  }

  // GET USER BY EMAIL (or user_id)
  async getUserByEmail(
    user_id: string,
    populateRole: boolean = false
  ): Promise<{ success: boolean; data?: IUser | null; message?: string }> {
    try {
      let query = User.findOne({ user_id });

      if (populateRole) {
        query = query.populate("roleId");
      }

      const user = await query;

      if (!user) {
        return {
          success: false,
          message: UserMessages.FETCH.NOT_FOUND
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || UserMessages.FETCH.FAILED_BY_ID
      };
    }
  }

  // GET USERS BY PROJECT ID
  async getUsersByProjectId(
    projectId: string
  ): Promise<{ success: boolean; data?: IUser[]; message?: string }> {
    try {
      if (!projectId) {
        return {
          success: false,
          message: UserMessages.PROJECT.ID_REQUIRED
        };
      }

      const users = await findUsersByProjectId(projectId);

      return {
        success: true,
        data: users
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || UserMessages.PROJECT.FETCH_FAILED
      };
    }
  }

  // PROCESS USER QUERY
  async processQuery(
    query: string,
    parsedQuery: Record<string, any>
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      if (!query || !parsedQuery) {
        return {
          success: false,
          message: UserMessages.QUERY.MISSING_FIELDS
        };
      }

      const queryConditions: any = {};

      if (parsedQuery.empcode) {
        queryConditions.user_id = parsedQuery.empcode;
      }

      if (parsedQuery.empname) {
        queryConditions.username = { $regex: `^${parsedQuery.empname}$`, $options: "i" };
      }

      const users = await User.find(queryConditions).populate("roleId", "name").lean();

      if (!users || users.length === 0) {
        return {
          success: false,
          message: UserMessages.QUERY.NOT_FOUND
        };
      }

      const organizationIds = Array.from(
        new Set(users.flatMap((user) => user.organization || []).filter((id) => id))
      );
      const organizations = organizationIds.length
        ? await findOrganizationsByIds(organizationIds)
        : [];
      const organizationMap = new Map(organizations.map((org: any) => [org.id, org]));

      const enrichedUsers = users.map((user) => ({
        ...user,
        organizations: (user.organization || [])
          .map((id: string) => organizationMap.get(id))
          .filter(Boolean)
      }));

      return {
        success: true,
        data: enrichedUsers,
        message: UserMessages.QUERY.SUCCESS
      };
    } catch (error: any) {
      console.error("Process query error:", error);
      return {
        success: false,
        message: error.message || UserMessages.QUERY.FAILED
      };
    }
  }

  async addSkills(
    id: string,
    newSkills: ISkill[]
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const user = await User.findOne({ id: id });
      if (!user) {
        return { success: false, message: UserMessages.SKILL.USER_NOT_FOUND };
      }

      const existingSkills = user.skills || [];

      const skillMap = new Map<string, ISkill>();
      for (const skill of existingSkills) {
        skillMap.set(skill.name.toLowerCase(), skill);
      }

      for (const newSkill of newSkills) {
        const existingSkill = skillMap.get(newSkill.name.toLowerCase());
        if (!existingSkill) {
          existingSkills.push(newSkill);
        } else {
          existingSkill.proficiency = newSkill.proficiency;
          if (newSkill.experience !== undefined) {
            existingSkill.experience = newSkill.experience;
          }
        }
      }

      user.skills = existingSkills;
      await user.save();

      return { success: true, data: existingSkills, message: UserMessages.SKILL.ADD_SUCCESS };
    } catch (error: any) {
      return { success: false, message: error.message || UserMessages.SKILL.UPDATE_FAILED };
    }
  }

  async updateSkill(
    userId: string,
    skillId: string,
    updatedSkill: Partial<ISkill>
  ): Promise<{ success: boolean; data?: ISkill; message?: string }> {
    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        return { success: false, message: UserMessages.SKILL.USER_NOT_FOUND };
      }

      if (!user.skills) {
        return { success: false, message: UserMessages.SKILL.NO_SKILLS };
      }

      const skillIndex = user.skills.findIndex((skill) => skill.skill_id === skillId);
      if (skillIndex === -1) {
        return { success: false, message: UserMessages.SKILL.NOT_FOUND };
      }

      const skill = user.skills[skillIndex];

      if (updatedSkill.name !== undefined) skill.name = updatedSkill.name;
      if (updatedSkill.proficiency !== undefined) skill.proficiency = updatedSkill.proficiency;
      if (updatedSkill.experience !== undefined) skill.experience = updatedSkill.experience;

      await user.save();

      return { success: true, data: skill, message: UserMessages.SKILL.UPDATE_SUCCESS };
    } catch (error: any) {
      return { success: false, message: error.message || UserMessages.SKILL.UPDATE_FAILED };
    }
  }

  async deleteSkill(
    userId: string,
    skillId: string
  ): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const user = await User.findOne({ id: userId });

      if (!user) {
        return { success: false, message: UserMessages.SKILL.USER_NOT_FOUND };
      }

      if (!Array.isArray(user.skills)) {
        return { success: false, message: UserMessages.SKILL.NO_SKILLS };
      }

      const initialLength = user.skills.length;

      user.skills = user.skills.filter((skill) => skill.skill_id !== skillId);

      if (user.skills.length === initialLength) {
        return { success: false, message: UserMessages.SKILL.NOT_FOUND };
      }

      await user.save();

      return { success: true, message: UserMessages.SKILL.DELETE_SUCCESS };
    } catch (error: any) {
      return { success: false, message: error.message || UserMessages.SKILL.DELETE_FAILED };
    }
  }

  async addCertificates(
    id: string,
    certificates: ICertificate[]
  ): Promise<{ success: boolean; data?: ICertificate[]; message?: string }> {
    try {
      const user = await User.findOne({ id });
      if (!user) return { success: false, message: UserMessages.FETCH.NOT_FOUND };

      if (!user.certificates) {
        user.certificates = [];
      }

      user.certificates.push(...certificates);
      await user.save();

      return {
        success: true,
        data: user.certificates,
        message: UserMessages.CERTIFICATE.ADD_SUCCESS
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || UserMessages.CERTIFICATE.UPDATE_FAILED
      };
    }
  }

  async updateCertificate(
    userId: string,
    certificateId: string,
    updatedCertificate: Partial<ICertificate>
  ): Promise<{ success: boolean; data?: ICertificate; message?: string }> {
    try {
      const user = await User.findOne({ id: userId });
      if (!user || !Array.isArray(user.certificates)) {
        return { success: false, message: UserMessages.CERTIFICATE.NOT_FOUND };
      }

      const cert = user.certificates.find((c) => c.certificate_id === certificateId);

      if (!cert) {
        return { success: false, message: UserMessages.CERTIFICATE.NOT_FOUND };
      }

      if (updatedCertificate.name !== undefined) cert.name = updatedCertificate.name;
      if (updatedCertificate.obtained_date !== undefined)
        cert.obtained_date = updatedCertificate.obtained_date;
      if (updatedCertificate.notes !== undefined) cert.notes = updatedCertificate.notes;

      await user.save();

      return {
        success: true,
        data: cert,
        message: UserMessages.CERTIFICATE.UPDATE_SUCCESS
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || UserMessages.CERTIFICATE.UPDATE_FAILED
      };
    }
  }

  async deleteCertificate(
    userId: string,
    certificateId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const user = await User.findOne({ id: userId });
      if (!user || !Array.isArray(user.certificates)) {
        return { success: false, message: UserMessages.CERTIFICATE.NOT_FOUND };
      }

      const originalLength = user.certificates.length;

      user.certificates = user.certificates.filter((cert) => cert.certificate_id !== certificateId);

      if (user.certificates.length === originalLength) {
        return { success: false, message: UserMessages.CERTIFICATE.NOT_FOUND };
      }

      await user.save();

      return { success: true, message: UserMessages.CERTIFICATE.DELETE_SUCCESS };
    } catch (error: unknown) {
      let errorMessage = UserMessages.CERTIFICATE.DELETE_FAILED;
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return { success: false, message: errorMessage };
    }
  }

  async getCertificates(
    userId: string
  ): Promise<{ success: boolean; data?: ICertificate[]; message?: string }> {
    try {
      const user = await User.findOne({ id: userId });
      if (!user) return { success: false, message: UserMessages.FETCH.NOT_FOUND };

      return { success: true, data: user.certificates || [] };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || UserMessages.CERTIFICATE.GET_FAILED
      };
    }
  }
}

export default new userService();

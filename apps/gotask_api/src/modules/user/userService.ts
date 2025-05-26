import UserMessages from "../../constants/apiMessages/userMessage";
import { findOrganizationsByIds } from "../../domain/interface/organization/organizationInterface";
import {
  createNewUser,
  deleteUserId,
  findAllUsers,
  findProjectsByIds,
  findUser,
  updateUserById
} from "../../domain/interface/user/userInterface";
import { IUser, User } from "../../domain/model/user/user";
import { Role } from "../../domain/model/role/role";
import { getRoleByIdService } from "../role/roleService";
import { findRoleByIds } from "../../domain/interface/role/roleInterface";
import { Organization } from "../../domain/model/organization/organization";
import { ExtendedParsedQuery } from "../../domain/interface/query/queryInterface";

// CREATE USER
const createUser = async (
  userData: IUser
): Promise<{ success: boolean; data?: any; message?: string }> => {
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
};

// GET ALL USERS
const getAllUsers = async (): Promise<{
  success: boolean;
  data?: IUser[];
  message?: string;
}> => {
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
};

// GET USER BY ID
const getUserById = async (id: string) => {
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
    delete userObj.password;

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

    userObj.role = enrichedRole;
    userObj.projectDetails = projectDetails;
    userObj.orgDetails = orgDetails;
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
};

// UPDATE USER
const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<{ success: boolean; data?: IUser | null; message?: string }> => {
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
};

// DELETE USER
const deleteUser = async (id: string): Promise<{ success: boolean; message?: string }> => {
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
};

// GET USER BY EMAIL (or user_id)
const getUserByEmail = async (
  user_id: string,
  populateRole: boolean = false
): Promise<{ success: boolean; data?: IUser | null; message?: string }> => {
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
};

// PROCESS USER QUERY
const processQuery = async (
  query: string,
  parsedQuery: ExtendedParsedQuery
): Promise<{ success: boolean; data?: any; message?: string }> => {
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
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  processQuery
};

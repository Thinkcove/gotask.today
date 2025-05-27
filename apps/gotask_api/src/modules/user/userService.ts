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

    // Create user
    const newUser = await createNewUser(userData);

    // Now update organization(s) users array
    if (userData.organization && userData.organization.length > 0) {
      await Organization.updateMany(
        { id: { $in: userData.organization } }, // Match multiple organizations by their id (UUID)
        { $addToSet: { users: newUser.id } } // Add user ID only if not already in array
      );
    }

    // Populate role name
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
    // Fetch all users
    const users = await findAllUsers();

    // Gather all unique role IDs and organization IDs (filter out undefined values)
    const allRoleIds = Array.from(
      new Set(users.map((user) => user.roleId?.toString()).filter(Boolean))
    );

    const allOrganizationIds = Array.from(
      new Set(users.flatMap((user) => user.organization?.filter((id) => id !== undefined) || []))
    );
    // Fetch roles and organizations in parallel
    const [roles, organizations] = await Promise.all([
      findRoleByIds(allRoleIds), // Fetch roles by IDs
      findOrganizationsByIds(allOrganizationIds) // Fetch organizations by IDs
    ]);

    // Map roles by their IDs for quick lookup
    const roleMap = new Map(roles.map((role: any) => [role._id.toString(), role]));

    // Map organization IDs to organization objects for easy lookup
    const organizationMap = new Map(
      organizations.map((organization: any) => [organization.id, organization])
    );

    // Attach enriched data (role and organization details) to each user
    const enrichedUsers = users.map((user) => {
      const userObj = user.toObject();
      // Enrich organizations
      const userOrganizations = (user.organization || [])
        .map((id: string) => organizationMap.get(id)) // Map to organization details
        .filter(Boolean); // Filter out undefined or null values

      // Enrich role
      const userRole = roleMap.get(user.roleId?.toString() || ""); // Map the single role by ID
      return {
        ...userObj,
        organizations: userOrganizations, // Attach organization details
        role: userRole || null // Attach role details (single role)
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
    // Find user and populate basic role info
    const user = await User.findOne({ id }).populate("roleId");

    if (!user) {
      return {
        success: false,
        message: UserMessages.FETCH.NOT_FOUND
      };
    }

    // Extract UUID role ID from populated roleId
    const roleId = user.roleId?.id?.toString();
    if (!roleId) {
      return {
        success: false,
        message: UserMessages.FETCH.ROLE_NOT_FOUND
      };
    }

    // Fetch enriched role details (with access)
    const roleResult = await getRoleByIdService(roleId);
    if (!roleResult.success || !roleResult.data) {
      return {
        success: false,
        message: roleResult.message || UserMessages.FETCH.FETCH_ROLE_FAILED
      };
    }

    const enrichedRole = roleResult.data;

    // Convert user to plain object and remove sensitive fields
    const userObj = user.toObject() as any;
    delete userObj.password;

    // --- New Project Enrichment Logic ---

    // Extract project IDs from user
    const projectIds = (userObj.projects || []).filter(
      (id: string | undefined) => id !== undefined
    );

    let projectDetails = [];
    if (projectIds.length > 0) {
      // Fetch project details
      const projects = await findProjectsByIds(projectIds);

      // Map projects for quick lookup
      const projectMap = new Map(projects.map((project: any) => [project.id, project]));

      // Map enriched project details
      projectDetails = projectIds.map((id: string) => projectMap.get(id)).filter(Boolean); // Remove undefineds if any
    }

    // Extract org  IDs from user
    const orgIds = (userObj.organization || []).filter(
      (id: string | undefined) => id !== undefined
    );
    let orgDetails = [];
    if (orgIds.length > 0) {
      // Fetch organization details
      const organizations = await findOrganizationsByIds(orgIds);

      // Map organization for quick lookup
      const organizationMap = new Map(organizations.map((org: any) => [org.id, org]));

      // Map enriched organization details
      orgDetails = orgIds.map((id: string) => organizationMap.get(id)).filter(Boolean); // Remove undefineds if any
    }

    // Attach enriched data
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

    // After updating user, if organization IDs are provided
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
      query = query.populate("roleId"); // Just populate the roleId, no nested populate
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

// GET USERS BY PROJECT ID - Fixed function
const getUsersByProjectId = async (
  projectId: string
): Promise<{
  success: boolean;
  data?: IUser[];
  message?: string;
}> => {
  try {
    // Validate project ID
    if (!projectId) {
      return {
        success: false,
        message: UserMessages.PROJECT.ID_REQUIRED
      };
    }

    // Call the database interface function
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
};

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUsersByProjectId
};

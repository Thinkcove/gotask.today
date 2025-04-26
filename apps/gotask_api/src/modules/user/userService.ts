import UserMessages from "../../constants/apiMessages/userMessage";
import { findOrganizationsByIds } from "../../domain/interface/organization/organizationInterface";
import {
  createNewUser,
  findAllUsers,
  findProjectsByIds,
  updateUserById
} from "../../domain/interface/user/userInterface";
import { IUser, User } from "../../domain/model/user/user";
import { Role } from "../../domain/model/role";
import { getRoleByIdService } from "../role/roleService";

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
    const users = await findAllUsers();

    // Gather all unique organization IDs (filter out undefined values)
    const allOrganizationIds = Array.from(
      new Set(users.flatMap((user) => user.organization?.filter((id) => id !== undefined) || []))
    );
    // Fetch organization details based on organization IDs
    const organizations = await findOrganizationsByIds(allOrganizationIds);

    // Map organization IDs to organization objects for easy lookup
    const organizationMap = new Map(
      organizations.map((organization) => [organization.id, organization])
    );

    // Attach organization details to each user
    const enrichedUsers = users.map((user) => ({
      ...user.toObject(),
      organizations: (user.organization || [])
        .map((id: string) => organizationMap.get(id)) // Map to user details
        .filter(Boolean) // Filter out undefined or null values
    }));

    return {
      success: true,
      data: enrichedUsers
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || UserMessages.FETCH.FAILED_ALL
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

    // Attach enriched data
    userObj.role = enrichedRole;
    userObj.projectDetails = projectDetails;

    return {
      success: true,
      data: userObj
    };
  } catch (error: any) {
    console.error("getUserById error:", error);
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
    const user = await User.findOne({ id });

    if (!user) {
      return {
        success: false,
        message: UserMessages.FETCH.NOT_FOUND
      };
    }

    await User.deleteOne({ id });

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

export { createUser, getAllUsers, getUserById, updateUser, deleteUser, getUserByEmail };

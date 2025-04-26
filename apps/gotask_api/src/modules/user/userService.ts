import UserMessages from "../../constants/apiMessages/userMessage";
import { findOrganizationsByIds } from "../../domain/interface/organization/organizationInterface";
import {
  createNewUser,
  findAllUsers,
  findProjectsByIds,
  findUserByEmail,
  findUserById,
  updateUserById
} from "../../domain/interface/user/userInterface";
import { IUser } from "../../domain/model/user/user";

// Create a new user
const createUser = async (
  userData: IUser
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    if (!userData) {
      return {
        success: false,
        message: UserMessages.CREATE.REQUIRED
      };
    }
    const newUser = await createNewUser(userData);
    return {
      success: true,
      data: newUser
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || UserMessages.CREATE.FAILED
    };
  }
};

// Get all users
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

// Get user by ID
const getUserById = async (
  id: string
): Promise<{ success: boolean; data?: IUser | null; message?: string }> => {
  try {
    const user = await findUserById(id);
    if (!user) {
      return {
        success: false,
        message: UserMessages.FETCH.NOT_FOUND
      };
    }

    // Extract project IDs from the project
    const projectIds = (user.projects || []).filter((id) => id !== undefined);

    // Fetch project details
    const projects = await findProjectsByIds(projectIds);

    // Map projects for quick lookup
    const projectMap = new Map(projects.map((project) => [project.id, project]));

    // Enrich the project with project details
    const enrichedProject = {
      ...user.toObject(),
      projectDetails: projectIds.map((id: string) => projectMap.get(id)).filter(Boolean)
    };

    return {
      success: true,
      data: enrichedProject
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || UserMessages.FETCH.FAILED_BY_ID
    };
  }
};

// Update user
const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<{ success: boolean; data?: IUser | null; message?: string }> => {
  try {
    const updatedUser = await updateUserById(id, updateData);
    if (!updatedUser) {
      return {
        success: false,
        message: UserMessages.FETCH.NOT_FOUND
      };
    }
    return {
      success: true,
      data: updatedUser
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || UserMessages.UPDATE.FAILED
    };
  }
};

// Find user by user_id (email)
const getUserByEmail = async (
  user_id: string
): Promise<{ success: boolean; data?: IUser | null; message?: string }> => {
  try {
    const user = await findUserByEmail(user_id);
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

export { createUser, getAllUsers, getUserById, updateUser, getUserByEmail };

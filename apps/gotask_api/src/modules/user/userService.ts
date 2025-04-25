import UserMessages from "../../constants/apiMessages/userMessage";
import {
  createNewUser,
  findAllUsers,
  updateUserById
} from "../../domain/interface/user/userInterface";
import { IUser, User } from "../../domain/model/user/user";
import { Role } from "../../domain/model/role";

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
        message: `Role ID "${userData.roleId}" is invalid or not found`
      };
    }

    // Create user
    const newUser = await createNewUser(userData);

    // Populate role name
    const populatedUser = await newUser.populate("roleId", "name");

    return {
      success: true,
      data: populatedUser
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
    return {
      success: true,
      data: users
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || UserMessages.FETCH.FAILED_ALL
    };
  }
};

// GET USER BY ID
import { getRoleByIdService } from "../role/roleService";

const getUserById = async (id: string) => {
  try {
    // Find user and populate basic role info
    const user = await User.findOne({ id }).populate("roleId");

    if (!user) {
      return {
        success: false,
        message: "User not found"
      };
    }

    // Extract UUID role ID from populated roleId
    const roleId = user.roleId?.id?.toString();
    if (!roleId) {
      return {
        success: false,
        message: "Role ID not found for this user"
      };
    }

    // Fetch enriched role details (with access)
    const roleResult = await getRoleByIdService(roleId);
    if (!roleResult.success || !roleResult.data) {
      return {
        success: false,
        message: roleResult.message || "Failed to fetch role details"
      };
    }

    const enrichedRole = roleResult.data;

    //  Return user with full role and remove password
    const userObj = user.toObject() as any;
    delete userObj.password;
    userObj.role = enrichedRole;

    return {
      success: true,
      data: userObj
    };
  } catch (error: any) {
    console.error("getUserById error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch user"
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
          message: `Role ID "${updateData.roleId}" is invalid or not found`
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
      data: updatedUser
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
        message: "User not found"
      };
    }

    await User.deleteOne({ id });

    return {
      success: true,
      message: "User deleted successfully"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete user"
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
        message: "User not found"
      };
    }

    return {
      success: true,
      data: user
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch user by email"
    };
  }
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser, getUserByEmail };

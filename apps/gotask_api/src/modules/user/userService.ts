import UserMessages from "../../constants/apiMessages/userMessage";
import {
  createNewUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  updateUserById,
} from "../../domain/interface/user/userInterface";
import { IUser, User } from "../../domain/model/user/user";
import { Role } from "../../domain/model/role";

// CREATE USER
const createUser = async (
  userData: IUser
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    if (!userData) {
      return {
        success: false,
        message: UserMessages.CREATE.REQUIRED,
      };
    }

    // 🆕 Step 1: Resolve role name to ID
    if (typeof userData.role === "string") {
      const roleDoc = await Role.findOne({ name: userData.role });
      if (!roleDoc) {
        return {
          success: false,
          message: `Role "${userData.role}" not found`,
        };
      }
      userData.role = roleDoc._id as any;
    }

    // Step 2: Create the user
    const newUser = await createNewUser(userData);

    // 🆕 Step 3: Populate role (name only)
    const populatedUser = await newUser.populate("role", "name");

    return {
      success: true,
      data: populatedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || UserMessages.CREATE.FAILED,
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
      data: users,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || UserMessages.FETCH.FAILED_ALL,
    };
  }
};

// GET USER BY ID
const getUserById = async (
  id: string
): Promise<{ success: boolean; data?: IUser | null; message?: string }> => {
  try {
    const user = await findUserById(id);
    if (!user) {
      return {
        success: false,
        message: UserMessages.FETCH.NOT_FOUND,
      };
    }
    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || UserMessages.FETCH.FAILED_BY_ID,
    };
  }
};

// UPDATE USER
const updateUser = async (
  id: string,
  updateData: Partial<IUser>
): Promise<{ success: boolean; data?: IUser | null; message?: string }> => {
  try {
    const updatedUser = await updateUserById(id, updateData);
    if (!updatedUser) {
      return {
        success: false,
        message: UserMessages.FETCH.NOT_FOUND,
      };
    }
    return {
      success: true,
      data: updatedUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || UserMessages.UPDATE.FAILED,
    };
  }
};

const getUserByEmail = async (
  user_id: string,
  populateRole: boolean = false
): Promise<{ success: boolean; data?: IUser | null; message?: string }> => {
  try {
    let query = User.findOne({ user_id });

    // Ensure that 'role' is populated if requested
    if (populateRole) {
      query = query.populate('role'); // Populate the 'role' field with the full Role document
    }

    const user = await query;

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to fetch user by email',
    };
  }
};






export { createUser, getAllUsers, getUserById, updateUser, getUserByEmail };

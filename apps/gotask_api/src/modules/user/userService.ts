import UserMessages from "../../constants/apiMessages/userMessage";
import {
  createNewUser,
  findAllUsers,
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

import UserMessages from "../../constants/apiMessages/userMessage";
import { IUser } from "../../domain/interface/user/userInterface";
import { User } from "../../domain/model/user/user";
import { Role } from "../../domain/model/role";
import { Access } from "../../domain/model/access";
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

    const newUser = new User(userData);
    const savedUser = await newUser.save();
    const populatedUser = await savedUser.populate("roleId", "name");

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
    const users = await User.find();
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

    const userObj = user.toObject() as any;
    delete userObj.password;
    userObj.role = roleResult.data;

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

    const updatedUser = await User.findOneAndUpdate({ id }, updateData, { new: true });
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

// GET USER BY EMAIL
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

    // Populate access records manually if needed
    const roleObj: any = user.roleId;
    if (populateRole && Array.isArray(roleObj?.access)) {
      const accessRecords = await Access.find({ id: { $in: roleObj.access } }).lean();
      roleObj.access = accessRecords;
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

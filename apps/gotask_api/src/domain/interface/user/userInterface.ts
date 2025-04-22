import { Access } from "../../model/access";
import { IUser, User } from "../../model/user/user";

const createNewUser = async (userData: IUser): Promise<IUser> => {
  const newUser = new User(userData);
  return await newUser.save();
};

const findAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

const findUserById = async (id: string): Promise<IUser | null> => {
  return await User.findOne({ id });
};

const updateUserById = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  return await User.findOneAndUpdate({ id }, updateData, { new: true });
};

const findUserByEmail = async (user_id: string): Promise<IUser | null> => {
  try {
    // Fetch the user by email, populate 'role'
    const user = await User.findOne({ user_id }).populate("role");

    // If user or role is not found, return null
    if (!user || !user.role) return null;

    const roleObj: any = user.role;

    // If the role has an 'access' array, fetch the associated Access records
    if (Array.isArray(roleObj.access)) {
      // Fetch access records using UUIDs stored in role.access
      const accessRecords = await Access.find({ id: { $in: roleObj.access } }).lean(); // <-- use .lean() to get plain objects
      roleObj.access = accessRecords;
    }

    return user; // Return the user with populated role and access details
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null; // Return null in case of error
  }
};



export { createNewUser, findAllUsers, findUserById, updateUserById, findUserByEmail };

import { Access } from "../../model/access";
import { IUser, User } from "../../model/user/user";

// Create a new user
const createNewUser = async (userData: IUser): Promise<IUser> => {
  try {
    const newUser = new User(userData);
    return await newUser.save();
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

// Find all users
const findAllUsers = async (): Promise<IUser[]> => {
  try {
    return await User.find();
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Failed to fetch users");
  }
};

// Find a user by ID with populated fields (role, access)
const findUserById = async (id: string): Promise<IUser | null> => {
  try {
    return await User.findOne({ id })
      .populate({
        path: 'role',
        populate: {
          path: 'access',
          model: 'Access',
          select: 'name application' // You can limit the fields returned from Access
        },
      })
      .exec();
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};

// Update a user by ID
const updateUserById = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  try {
    return await User.findOneAndUpdate({ id }, updateData, { new: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

// Find a user by email and populate role with access
const findUserByEmail = async (user_id: string): Promise<IUser | null> => {
  try {
    const user = await User.findOne({ user_id }).populate("role");
    
    // If user or role is not found, return null
    if (!user || !user.role) return null;

    const roleObj: any = user.role;

    // If role has an 'access' array, fetch associated Access records
    if (Array.isArray(roleObj.access)) {
      const accessRecords = await Access.find({ id: { $in: roleObj.access } }).lean(); // Use .lean() for plain objects
      roleObj.access = accessRecords;
    }

    return user; // Return user with populated role and access details
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

export { createNewUser, findAllUsers, findUserById, updateUserById, findUserByEmail };

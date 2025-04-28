import { Access } from "../../model/access/access";
import { Project } from "../../model/project/project";
import { IUser, User } from "../../model/user/user";

// Create a new user
const createNewUser = async (userData: IUser): Promise<IUser> => {
  const newUser = new User(userData);
  return await newUser.save();
};

// Find all users
const findAllUsers = async (): Promise<IUser[]> => {
  return await User.find().sort({ updatedAt: -1 });
};

// Find a user by ID with populated fields (roleId → role → access)
const findUserById = async (id: string): Promise<IUser | null> => {
  return await User.findOne({ id })
    .populate({
      path: "roleId",
      populate: {
        path: "access",
        model: "Access",
        select: "name application"
      }
    })
    .exec();
};

// Update a user by ID
const findUsersByIds = async (userIds: string[]): Promise<IUser[]> => {
  const users = await User.find({ id: { $in: userIds } }).exec();
  return users;
};

const updateUserById = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  return await User.findOneAndUpdate({ id }, updateData, { new: true });
};

// Find a user by email and populate roleId with access
const findUserByEmail = async (user_id: string): Promise<IUser | null> => {
  const user = await User.findOne({ user_id }).populate("roleId");

  if (!user || !user.roleId) return null;

  const roleObj: any = user.roleId;

  if (Array.isArray(roleObj.access)) {
    const accessRecords = await Access.find({ id: { $in: roleObj.access } }).lean();
    roleObj.access = accessRecords;
  }

  return user;
};

// Get users by an array of user IDs
const findProjectsByIds = async (projectIds: string[]) => {
  return await Project.find({ id: { $in: projectIds } });
};

// Find all userby id
const findUser = async (id: string): Promise<IUser[] | null> => {
  return await User.findOne({ id });
};

// delete user
const deleteUserId = async (id: string): Promise<IUser[] | null> => {
  return await User.findOneAndDelete({ id });
};

export {
  createNewUser,
  findAllUsers,
  findUserById,
  updateUserById,
  findUserByEmail,
  findUsersByIds,
  findProjectsByIds,
  findUser,
  deleteUserId
};

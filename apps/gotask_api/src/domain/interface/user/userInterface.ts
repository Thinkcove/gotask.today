import { Project } from "../../model/project/project";
import { IUser, User } from "../../model/user/user";

const createNewUser = async (userData: IUser): Promise<IUser> => {
  const newUser = new User(userData);
  return await newUser.save();
};

const findAllUsers = async (): Promise<IUser[]> => {
  return await User.find().sort({ updatedAt: -1 });
};

const findUserById = async (id: string): Promise<IUser | null> => {
  return await User.findOne({ id });
};

const findUsersByIds = async (userIds: string[]): Promise<IUser[]> => {
  try {
    // Find users by their ids
    const users = await User.find({ id: { $in: userIds } }).exec();
    return users;
  } catch (error) {
    throw new Error("Error fetching users");
  }
};

const updateUserById = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
  return await User.findOneAndUpdate({ id }, updateData, { new: true });
};

const findUserByEmail = async (user_id: string): Promise<IUser | null> => {
  return await User.findOne({ user_id });
};

// Get users by an array of user IDs
const findProjectsByIds = async (projectIds: string[]) => {
  return await Project.find({ id: { $in: projectIds } });
};

export {
  createNewUser,
  findAllUsers,
  findUserById,
  updateUserById,
  findUserByEmail,
  findUsersByIds,
  findProjectsByIds
};

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

// Updated ✅
const findUserByEmail = async (user_id: string): Promise<IUser | null> => {
  return await User.findOne({ user_id })
    .populate({
      path: "role",                 // populate role
      populate: {
        path: "access",              // populate role.access
        model: "Access"              // make sure this matches Access model name
      }
    });
};


export { createNewUser, findAllUsers, findUserById, updateUserById, findUserByEmail };

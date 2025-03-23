import { IUser, User } from "../../domain/model/user";

export class UserService {
  // Create a new user
  static async createUser(userData: IUser): Promise<IUser> {
    const newUser = new User(userData);
    return await newUser.save();
  }

  // Get all users
  static async getAllUsers(): Promise<IUser[]> {
    return await User.find(); // Fetch all users
  }

  // Get a user by ID
  static async getUserById(id: string): Promise<IUser | null> {
    return await User.findOne({ id });
  }

  // Update user details
  static async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findOneAndUpdate({ id }, updateData, { new: true });
  }

  // Find user by email (for login)
  static async getUserByEmail(user_id: string): Promise<IUser | null> {
    return await User.findOne({ user_id });
  }
}

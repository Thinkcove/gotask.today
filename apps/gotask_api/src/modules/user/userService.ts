import { IUser } from "../../domain/interface/user";
import { User } from "../../domain/model/user";

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
}

import { IAccess, Access } from "../../domain/model/access";

export class AccessService {
  // Create a new access record
  static async createAccess(accessData: IAccess): Promise<IAccess> {
    const newAccess = new Access({
      name: accessData.name,
      application: accessData.application,
    });
    return await newAccess.save();
  }

  // Get all access records
  static async getAllAccesses(): Promise<IAccess[]> {
    return await Access.find();
  }

  // Get a specific access by ID
  static async getAccessById(id: string): Promise<IAccess | null> {
    return await Access.findOne({ id });
  }

  // Update access record by ID
  static async updateAccessById(id: string, data: Partial<IAccess>): Promise<IAccess | null> {
    const updated = await Access.findOneAndUpdate({ id }, data, {
      new: true,
      runValidators: true,
    });
    return updated;
  }

  // Delete access record by ID
  static async deleteAccessById(id: string): Promise<IAccess | null> {
    return await Access.findOneAndDelete({ id });
  }
}

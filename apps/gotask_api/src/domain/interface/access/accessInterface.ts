import { Access, IAccess } from "../../model/access/access";

// Create a new access record
export const createAccessInDb = async (accessData: Partial<IAccess>): Promise<IAccess> => {
  const newAccess = new Access({
    name: accessData.name,
    application: accessData.application
  });
  return await newAccess.save();
};

// Get all access records
export const getAllAccessRecordsFromDb = async (): Promise<IAccess[]> => {
  return await Access.find();
};

// Get a specific access by ID
export const getAccessByIdFromDb = async (id: string): Promise<IAccess | null> => {
  return await Access.findOne({ id });
};

// Update access record by ID
export const updateAccessInDb = async (
  id: string,
  updateData: Partial<IAccess>
): Promise<IAccess | null> => {
  return await Access.findOneAndUpdate({ id }, updateData, {
    new: true,
    runValidators: true
  });
};

// Delete access record by ID
export const deleteAccessByIdFromDb = async (id: string): Promise<boolean> => {
  const deletedAccess = await Access.findOneAndDelete({ id });
  return deletedAccess !== null;
};

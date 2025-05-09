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

export const getAccessByIdFromDb = async (id: string): Promise<IAccess | null> => {
  return await Access.findOne({ id });
};

// Update access record by custom unique ID (e.g., UUID or string)
export const updateAccessInDb = async (
  id: string,
  updateData: Partial<IAccess>
): Promise<IAccess | null> => {
  // No need to check for MongoDB ObjectId validity since you're using custom `id`
  return await Access.findOneAndUpdate(
    { id }, // Query by custom `id`
    updateData,
    { new: true, runValidators: true } // Return updated record and apply validations
  );
};

// Delete access record by custom unique ID (e.g., UUID or string)
export const deleteAccessByIdFromDb = async (id: string): Promise<boolean> => {
  const deletedAccess = await Access.findOneAndDelete({ id }); // Query by custom `id`
  return deletedAccess !== null;
};

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
  return await Access.find().exec(); // .exec() returns a real Promise
};

// Get access record by custom unique ID (e.g., UUID or string)
export const getAccessByIdFromDb = async (id: string): Promise<IAccess | null> => {
  // Assuming `id` is a custom unique field, not _id
  return await Access.findOne({ id }).exec();
};

// Update access record by custom unique ID
export const updateAccessInDb = async (
  id: string,
  updateData: Partial<IAccess>
): Promise<IAccess | null> => {
  return await Access.findOneAndUpdate(
    { id }, // Query by custom `id`
    updateData,
    { new: true, runValidators: true }
  ).exec();
};

// Delete access record by custom unique ID
export const deleteAccessByIdFromDb = async (id: string): Promise<boolean> => {
  const deletedAccess = await Access.findOneAndDelete({ id }).exec();
  return deletedAccess !== null;
};

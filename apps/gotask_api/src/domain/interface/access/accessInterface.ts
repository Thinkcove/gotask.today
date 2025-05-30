import { Access, IAccess } from "../../model/access/access";

// Create a new access record
export const createAccessInDb = async (accessData: Partial<IAccess>): Promise<IAccess> => {
  const newAccess = new Access({
    name: accessData.name,
    accesses: accessData.accesses // updated field name
  });
  return await newAccess.save();
};

// Get all access records
export const getAllAccessRecordsFromDb = async (): Promise<IAccess[]> => {
  return await Access.find().exec();
};

// Get access record by custom UUID `id`
export const getAccessByIdFromDb = async (id: string): Promise<IAccess | null> => {
  return await Access.findOne({ id }).exec();
};

// Update access record by `id`
export const updateAccessInDb = async (
  id: string,
  updateData: Partial<IAccess>
): Promise<IAccess | null> => {
  return await Access.findOneAndUpdate(
    { id },
    { $set: updateData },
    { new: true, runValidators: true }
  ).exec();
};

// Delete access by `id`
export const deleteAccessByIdFromDb = async (id: string): Promise<boolean> => {
  const deleted = await Access.findOneAndDelete({ id }).exec();
  return !!deleted;
};

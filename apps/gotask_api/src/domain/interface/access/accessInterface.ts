import { Access, IAccess } from "../../model/access/access";

// Create a new access record
export const createAccessInDb = async (accessData: Partial<IAccess>): Promise<IAccess> => {
  const application = accessData.application?.map((app) => ({
    access: app.access,
    actions: app.actions,
    restrictedFields: app.restrictedFields || {} // just use plain object directly
  }));

  const newAccess = new Access({
    name: accessData.name,
    application
  });

  return await newAccess.save();
};

// Get all access records
export const getAllAccessRecordsFromDb = async (): Promise<IAccess[]> => {
  return await Access.find();
};

// Get access by id
export const getAccessByIdFromDb = async (id: string): Promise<IAccess | null> => {
  return await Access.findOne({ id });
};

// Update access record by id
export const updateAccessInDb = async (
  id: string,
  updateData: Partial<IAccess>
): Promise<IAccess | null> => {
  if (updateData.application) {
    updateData.application = updateData.application.map((app) => ({
      access: app.access,
      actions: app.actions,
      restrictedFields: app.restrictedFields || {}
    }));
  }

  return await Access.findOneAndUpdate({ id }, updateData, {
    new: true,
    runValidators: true
  });
};

// Delete access by id
export const deleteAccessByIdFromDb = async (id: string): Promise<boolean> => {
  const deletedAccess = await Access.findOneAndDelete({ id });
  return deletedAccess !== null;
};

import mongoose from "mongoose";
import { Access } from "../../model/access/access";
import { Role, IRole, CreateRolePayload } from "../../model/role/role";

// Check if role exists by name
export const roleExistsByName = async (name: string): Promise<boolean> => {
  const exists = await Role.findOne({ name });
  return exists !== null;
};

// Fetch access records from the database
export const getAccessRecords = async (accessIds: string[]): Promise<string[]> => {
  const accessRecords = await Access.find({ id: { $in: accessIds } });
  return accessRecords.map((access) => access.id);
};

// Create a new role
export const createRoleInDb = async (name: string, accessIds: string[]): Promise<IRole> => {
  const linkedAccesses = await getAccessRecords(accessIds);
  const role = new Role({
    name,
    access: linkedAccesses
  });
  return await role.save();
};

// Get all roles from the database
export const getAllRolesFromDb = async (): Promise<IRole[]> => {
  return await Role.find().sort({ updatedAt: -1 });
};

// Get a single role by ID
export const getRoleByIdFromDb = async (roleId: string): Promise<IRole | null> => {
  return await Role.findOne({ id: roleId });
};

// Update an existing role
export const updateRoleInDb = async (
  roleId: string,
  updatedData: Partial<CreateRolePayload>
): Promise<IRole | null> => {
  const role = await Role.findOne({ id: roleId });
  if (!role) return null;

  if (updatedData.name !== undefined) {
    role.name = updatedData.name;
  }

  if (updatedData.accessIds && updatedData.accessIds.length > 0) {
    const newAccesses = await getAccessRecords(updatedData.accessIds);

    // Merge existing access with new, avoiding duplicates
    const accessSet = new Set([...role.access, ...newAccesses]);
    role.access = Array.from(accessSet);
  }

  return await role.save();
};

// Delete a role by ID
export const deleteRoleInDb = async (roleId: string): Promise<boolean> => {
  const result = await Role.findOneAndDelete({ id: roleId });
  return result !== null;
};

// Get roles by a single role ID
export const findRoleByIds = async (roleIds: string[]): Promise<any[]> => {
  const roleObjectIds = roleIds.map((id) => new mongoose.Types.ObjectId(id));
  return await Role.find({ _id: { $in: roleObjectIds } });
};

//update a role by their id
export const updateRoleById = async (
  id: string,
  updateData: Partial<IRole>
): Promise<IRole | null> => {
  return await Role.findOneAndUpdate({ id }, updateData, { new: true });
};

//remove access from a role
export const removeAccess = async (roleId: string, accessId: string): Promise<IRole | null> => {
  const role = await Role.findOne({ id: roleId });
  if (!role) return null;
  role.access = role.access.filter((id: string) => id !== accessId);
  return await role.save();
};

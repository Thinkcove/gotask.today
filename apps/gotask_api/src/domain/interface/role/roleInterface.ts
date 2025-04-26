import mongoose from "mongoose";
import { Access } from "../../model/access";
import { Role, IRole, CreateRolePayload } from "../../model/role";

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
export const createRoleInDb = async (
  name: string,
  priority: number,
  accessIds: string[]
): Promise<IRole> => {
  const linkedAccesses = await getAccessRecords(accessIds);
  const role = new Role({
    name,
    priority,
    access: linkedAccesses
  });
  return await role.save();
};

// Get all roles from the database
export const getAllRolesFromDb = async (): Promise<IRole[]> => {
  return await Role.find().sort({ priority: 1 });
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

  if (updatedData.name !== undefined) role.name = updatedData.name;
  if (updatedData.priority !== undefined) role.priority = updatedData.priority;

  if (updatedData.accessIds) {
    const linkedAccesses = await getAccessRecords(updatedData.accessIds);
    role.access = linkedAccesses;
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

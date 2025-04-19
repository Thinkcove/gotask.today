import { Role } from "../../domain/model/role";
import { RoleAccess } from "../../domain/model/roleAccess";
import { Access } from "../../domain/model/access";

interface CreateRolePayload {
  name: string;
  priority: number;
  accessIds?: string[];
}

// Create Role Logic
export const createRoleService = async (data: CreateRolePayload) => {
  try {
    const { name, priority, accessIds = [] } = data;

    const exists = await Role.findOne({ name });
    if (exists) {
      return { success: false, message: "Role already exists" };
    }

    const role = new Role({ name, priority });
    await role.save();

    const linkedAccesses = [];
    for (const accessId of accessIds) {
      const accessExists = await Access.findOne({ id: accessId });
      if (accessExists) {
        const roleAccess = new RoleAccess({
          role_id: role.id,
          access_id: accessId
        });
        await roleAccess.save();
        linkedAccesses.push(roleAccess);
      }
    }

    return {
      success: true,
      data: {
        message: "Role created successfully",
        role,
        linkedAccesses
      }
    };
  } catch (error) {
    console.error("Error in createRoleService:", error);
    return { success: false, message: "Internal server error" };
  }
};

// Get All Roles
export const getAllRolesService = async () => {
  try {
    const roles = await Role.find().sort({ priority: 1 });
    return { success: true, data: roles };
  } catch (error) {
    console.error("Error in getAllRolesService:", error);
    return { success: false, message: "Internal server error" };
  }
};

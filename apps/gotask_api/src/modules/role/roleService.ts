import { roleMessages } from "../../constants/apiMessages/roleMessages";
import { CreateRolePayload } from "../../domain/model/role/role";
import * as RoleInterface from "../../domain/interface/role/roleInterface";
import { Access } from "../../domain/model/access/access";

// Create Role Logic
export const createRoleService = async (data: CreateRolePayload) => {
  try {
    const { name, priority, accessIds = [] } = data;

    const exists = await RoleInterface.roleExistsByName(name);
    if (exists) {
      return { success: false, message: roleMessages.CREATE.ALREADY_EXISTS };
    }

    // Create the new role and save the associated access references
    const role = await RoleInterface.createRoleInDb(name, priority, accessIds);

    return {
      success: true,
      data: {
        message: roleMessages.CREATE.SUCCESS,
        role
      }
    };
  } catch (error) {
    console.error("Error in createRoleService:", error);
    return { success: false, message: roleMessages.CREATE.FAILED };
  }
};

// Get All Roles
export const getAllRolesService = async () => {
  try {
    const roles = await RoleInterface.getAllRolesFromDb();

    const enhancedRoles = [];

    for (const role of roles) {
      const accessRecords = await Access.find({
        id: { $in: role.access }
      });

      const roleObj = role.toObject();
      const accessDetails = accessRecords.map((access) => ({
        id: access.id,
        name: access.name,
        application: access.application
      }));

      enhancedRoles.push({
        ...roleObj,
        accessDetails
      });
    }

    return { success: true, data: enhancedRoles };
  } catch (error) {
    console.error("Error in getAllRolesService:", error);
    return { success: false, message: roleMessages.FETCH.FAILED };
  }
};

// Get Role by ID
export const getRoleByIdService = async (roleId: string) => {
  try {
    const role = await RoleInterface.getRoleByIdFromDb(roleId);
    if (!role) {
      return { success: false, message: roleMessages.FETCH.NOT_FOUND };
    }

    const accessRecords = await Access.find({ id: { $in: role.access } });

    const roleObj = role.toObject();
    const accessDetails = accessRecords.map((access) => ({
      id: access.id,
      name: access.name,
      application: access.application
    }));

    return {
      success: true,
      data: {
        ...roleObj,
        accessDetails
      }
    };
  } catch (error) {
    console.error("Error in getRoleByIdService:", error);
    return { success: false, message: roleMessages.FETCH.FAILED };
  }
};

// Update Role
export const updateRoleService = async (
  roleId: string,
  updatedData: Partial<CreateRolePayload>
) => {
  try {
    const role = await RoleInterface.updateRoleInDb(roleId, updatedData);
    if (!role) {
      return { success: false, message: roleMessages.FETCH.NOT_FOUND };
    }

    return {
      success: true,
      data: {
        message: roleMessages.UPDATE.SUCCESS,
        role
      }
    };
  } catch (error) {
    console.error("Error in updateRoleService:", error);
    return { success: false, message: roleMessages.UPDATE.FAILED };
  }
};

// Delete Role
export const deleteRoleService = async (roleId: string) => {
  try {
    const success = await RoleInterface.deleteRoleInDb(roleId);

    if (!success) {
      return { success: false, message: roleMessages.FETCH.NOT_FOUND };
    }

    return {
      success: true,
      data: {
        message: roleMessages.DELETE.SUCCESS
      }
    };
  } catch (error) {
    console.error("Error in deleteRoleService:", error);
    return { success: false, message: roleMessages.DELETE.FAILED };
  }
};

import { roleMessages } from "../../constants/apiMessages/roleMessages";
import { CreateRolePayload } from "../../domain/model/role/role";
import * as RoleInterface from "../../domain/interface/role/roleInterface";
import { Access } from "../../domain/model/access/access";

// Helper to serialize Access for response
const serializeAccess = (access: any) => ({
  id: access.id,
  name: access.name,
  application: access.application.map((app: any) => ({
    access: app.access,
    actions: app.actions,
    restrictedFields: app.restrictedFields
      ? Object.fromEntries(app.restrictedFields)
      : {}
  }))
});

// Create Role
export const createRoleService = async (data: CreateRolePayload) => {
  try {
    const { name, accessIds = [] } = data;

    const exists = await RoleInterface.roleExistsByName(name);
    if (exists) {
      return { success: false, message: roleMessages.CREATE.ALREADY_EXISTS };
    }

    const role = await RoleInterface.createRoleInDb(name, accessIds);

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
      const accessRecords = await Access.find({ id: { $in: role.access } });
      const roleObj = role.toObject();

      const accessDetails = accessRecords.map(serializeAccess);

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
    const accessDetails = accessRecords.map(serializeAccess);

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

// Remove Access from Role
export const removeAccessFromRoleService = async (
  roleId: string,
  accessId: string
) => {
  try {
    const updatedRole = await RoleInterface.removeAccess(roleId, accessId);
    if (!updatedRole) {
      return { success: false, message: roleMessages.FETCH.NOT_FOUND };
    }
    return {
      success: true,
      data: {
        message: roleMessages.DELETE.ACCESS_DELETE,
        role: updatedRole
      }
    };
  } catch (error) {
    console.error("Error in removeAccessFromRoleService:", error);
    return { success: false, message: roleMessages.UPDATE.FAILED };
  }
};

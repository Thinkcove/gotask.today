import { roleMessages } from "../../constants/apiMessages/roleMessages";
import { CreateRolePayload, Role } from "../../domain/model/role/role";
import * as RoleInterface from "../../domain/interface/role/roleInterface";
import { Access } from "../../domain/model/access/access";

const serializeAccess = (access: any) => ({
  id: access.id,
  name: access.name,
  application: access.application.map((app: any) => ({
    access: app.access,
    actions: app.actions,
    restrictedFields: app.restrictedFields ? Object.fromEntries(app.restrictedFields) : {}
  }))
});

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
    return { success: false, message: roleMessages.CREATE.FAILED };
  }
};

export const getRoleByIdService = async (roleId: string) => {
  try {
    // Find the role by its UUID string id
    const role = await Role.findOne({ id: roleId });

    if (!role) {
      return {
        success: false,
        message: roleMessages.FETCH.NOT_FOUND
      };
    }

    // Fetch all Access records whose 'id' matches any in role.access array
    const accessRecords = await Access.find({ id: { $in: role.access } });

    // Compose the role object with populated access details
    const roleWithAccess = {
      id: role.id,
      name: role.name,
      access: accessRecords
    };

    return {
      success: true,
      message: roleMessages.FETCH.BY_ID_SUCCESS,
      data: roleWithAccess
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || roleMessages.FETCH.FAILED
    };
  }
};

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
    return { success: false, message: roleMessages.UPDATE.FAILED };
  }
};

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
    return { success: false, message: roleMessages.DELETE.FAILED };
  }
};

export const removeAccessFromRoleService = async (roleId: string, accessId: string) => {
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
    return { success: false, message: roleMessages.UPDATE.FAILED };
  }
};

export const getAllRolesService = async () => {
  try {
    const roles = await RoleInterface.getAllRolesFromDb();

    const enhancedRoles = [];

    for (const role of roles) {
      const accessRecords = await Access.find({ id: { $in: role.access } });
      const accessDetails = accessRecords.map(serializeAccess);

      enhancedRoles.push({
        ...role.toObject(),
        accessDetails
      });
    }

    return { success: true, data: enhancedRoles };
  } catch (error) {
    return { success: false, message: roleMessages.FETCH.FAILED };
  }
};

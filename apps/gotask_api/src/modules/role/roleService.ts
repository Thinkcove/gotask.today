// src/modules/role/roleService.ts
import { roleMessages } from "../../constants/apiMessages/roleMessages"; // Import the messages
import { Role } from "../../domain/model/role";
import { Access } from "../../domain/model/access";

interface CreateRolePayload {
  name: string;
  priority: number;
  accessIds?: string[]; // UUIDs passed as strings
}

// Create Role Logic
export const createRoleService = async (data: CreateRolePayload) => {
  try {
    const { name, priority, accessIds = [] } = data;

    // Check if the role already exists
    const exists = await Role.findOne({ name });
    if (exists) {
      return { success: false, message: roleMessages.CREATE.ALREADY_EXISTS }; // Use constant
    }

    // Validate the access IDs and fetch associated access documents
    const linkedAccesses = [];
    for (const accessId of accessIds) {
      const accessExists = await Access.findOne({ id: accessId }); // Search by UUID `id`
      if (accessExists) {
        linkedAccesses.push(accessExists.id); // Push the UUID to the array (not ObjectId)
      }
    }

    // Create the new role and save the associated access references (UUIDs)
    const role = new Role({
      name,
      priority,
      access: linkedAccesses // Store UUIDs in the access field
    });

    await role.save();

    return {
      success: true,
      data: {
        message: roleMessages.CREATE.SUCCESS, // Use constant
        role
      }
    };
  } catch (error) {
    console.error("Error in createRoleService:", error);
    return { success: false, message: roleMessages.CREATE.FAILED }; // Use constant
  }
};

// Get All Roles
export const getAllRolesService = async () => {
  try {
    const roles = await Role.find().sort({ priority: 1 });

    const enhancedRoles = [];

    for (const role of roles) {
      // Fetch full access records based on UUIDs
      const accessRecords = await Access.find({
        id: { $in: role.access }
      });

      // Convert Mongoose document to plain object
      const roleObj = role.toObject();

      // Replace access UUIDs with full access detail objects
      const accessDetails = accessRecords.map((access) => ({
        id: access.id,
        name: access.name,
        application: access.application
      }));

      // Create a new object with full access data
      enhancedRoles.push({
        ...roleObj,
        accessDetails // separate key to avoid type issues
      });
    }

    return { success: true, data: enhancedRoles };
  } catch (error) {
    console.error("Error in getAllRolesService:", error);
    return { success: false, message: roleMessages.FETCH.FAILED }; // Use constant
  }
};

// Get Role by ID
export const getRoleByIdService = async (roleId: string) => {
  try {
    const role = await Role.findOne({ id: roleId });
    if (!role) {
      return { success: false, message: roleMessages.FETCH.NOT_FOUND }; // Use constant
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
    return { success: false, message: roleMessages.FETCH.FAILED }; // Use constant
  }
};

// Update Role
export const updateRoleService = async (
  roleId: string,
  updatedData: Partial<CreateRolePayload>
) => {
  try {
    const role = await Role.findOne({ id: roleId }); // Find by UUID
    if (!role) {
      return { success: false, message: roleMessages.FETCH.NOT_FOUND }; // Use constant
    }

    const { name, priority, accessIds } = updatedData;

    if (name !== undefined) role.name = name;
    if (priority !== undefined) role.priority = priority;

    if (accessIds) {
      const linkedAccesses = [];

      for (const accessId of accessIds) {
        const accessExists = await Access.findOne({ id: accessId });
        if (accessExists) {
          linkedAccesses.push(accessExists.id);
        }
      }

      role.access = linkedAccesses;
    }

    await role.save();

    return {
      success: true,
      data: {
        message: roleMessages.UPDATE.SUCCESS, // Use constant
        role
      }
    };
  } catch (error) {
    console.error("Error in updateRoleService:", error);
    return { success: false, message: roleMessages.UPDATE.FAILED }; // Use constant
  }
};

// Delete Role
export const deleteRoleService = async (roleId: string) => {
  try {
    const role = await Role.findOneAndDelete({ id: roleId });

    if (!role) {
      return { success: false, message: roleMessages.FETCH.NOT_FOUND }; // Use constant
    }

    return {
      success: true,
      data: {
        message: roleMessages.DELETE.SUCCESS // Use constant
      }
    };
  } catch (error) {
    console.error("Error in deleteRoleService:", error);
    return { success: false, message: roleMessages.DELETE.FAILED }; // Use constant
  }
};

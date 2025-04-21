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

    // Check if the role already exists
    const exists = await Role.findOne({ name });
    if (exists) {
      return { success: false, message: "Role already exists" };
    }

    // Validate the access IDs
    const linkedAccesses = [];
    for (const accessId of accessIds) {
      const accessExists = await Access.findOne({ _id: accessId });
      if (accessExists) {
        linkedAccesses.push(accessExists._id);  // Push the ObjectId of the access document
      }
    }

    // Create the new role and save the associated access IDs
    const role = new Role({
      name,
      priority,
      access: linkedAccesses  // Store ObjectIds of Access directly in the role
    });

    await role.save();

    return {
      success: true,
      data: {
        message: "Role created successfully",
        role
      }
    };
  } catch (error) {
    console.error("Error in createRoleService:", error);
    return { success: false, message: "Internal server error" };
  }
};



export const getAllRolesService = async () => {
  try {
    const roles = await Role.find()
                             .sort({ priority: 1 })
                             .populate('access');  // This will populate the access field

    console.log(roles);  // Log the roles to inspect if access is populated
    return { success: true, data: roles };
  } catch (error) {
    console.error("Error in getAllRolesService:", error);
    return { success: false, message: "Internal server error" };
  }
};



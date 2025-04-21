import { Role } from "../../domain/model/role";
import { Access } from "../../domain/model/access";
import { access } from "fs";

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
      return { success: false, message: "Role already exists" };
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
    // Fetch all roles
    const roles = await Role.find().sort({ priority: 1 });

    // For each role, fetch the access documents manually based on UUIDs
    console.log('helo',roles);
    for (let role of roles) {
      const accessRecords = await Access.find({
        id: { $in: role.access } // Find access records matching the UUIDs in the role's access field
      });
console.log('dfghj',accessRecords);
      // Map the access records to only their 'id' (UUID)
      role.access = accessRecords.map(access => access.id);  // Ensure we store only UUIDs
      ;
    }
    console.log('role',roles);

     // Log the roles to inspect if access is populated correctly
    return { success: true, data: roles };
  } catch (error) {
    console.error("Error in getAllRolesService:", error);
    return { success: false, message: "Internal server error" };
  }
};



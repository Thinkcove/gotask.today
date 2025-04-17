import { Request, ResponseToolkit } from "@hapi/hapi";
import { Role } from "../../domain/model/role";
import { RoleAccess } from "../../domain/model/roleAccess";
import { Access } from "../../domain/model/access";

// Define a type for the request payload
interface CreateRolePayload {
  name: string;
  priority: number;
  accessIds?: string[]; // Optional array of Access IDs
}


// Create a new role
export const createRole = async (req: Request, h: ResponseToolkit) => {
  try {
    const { name, priority, accessIds = [] }: CreateRolePayload = req.payload as CreateRolePayload;

    // Check for duplicate role
    const exists = await Role.findOne({ name });
    if (exists) {
      return h.response({ message: "Role already exists" }).code(409);
    }

    // Create the new role
    const role = new Role({ name, priority });
    await role.save();

    // Link role to access rights if any are provided
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

    return h.response({
      message: "Role created successfully",
      role,
      linkedAccesses
    }).code(201);

  } catch (err) {
    console.error("Error creating role:", err);
    return h.response({ error: "Failed to create role" }).code(500);
  }
};


// Get all roles
export const getAllRoles = async (_req: Request, h: ResponseToolkit) => {
  try {
    const roles = await Role.find().sort({ priority: 1 }); // Sort by priority, lower number = higher authority
    return h.response(roles).code(200);
  } catch (err) {
    console.error("Error fetching roles:", err);
    return h.response({ error: "Failed to fetch roles" }).code(500);
  }
};

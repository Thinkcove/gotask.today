// accessControls.ts

// Define the expected user role access structure
interface User {
  role?: {
    name: string;
    accesses: {
      module: string;
      actions: string[];
      restrictedFields?: { [action: string]: string[] };
    }[];
  };
}

/**
 * Checks if the user has permission for the given module and action.
 * If a field is specified, checks if the field is restricted under that action.
 *
 * @param user - the user object containing role and accesses
 * @param moduleName - the name of the module to check access for (e.g., "User Management")
 * @param action - the action string to check (e.g., "READ", "CREATE")
 * @param field - optional, the specific field to check access for
 * @returns boolean - true if access is granted, false if denied
 */
export function hasAccess(
  user: User,
  moduleName: string,
  action: string,
  field?: string
): boolean {
  const accesses = user?.role?.accesses || [];

  for (const access of accesses) {
    if (access.module === moduleName && access.actions.includes(action)) {
      // If no field-level restriction to check, allow access
      if (!field) return true;

      // Check if the field is restricted for this action
      const restricted = access.restrictedFields?.[action] || [];
      if (restricted.includes(field)) {
        return false; // Access denied due to restricted field
      }

      return true; // Access allowed
    }
  }

  // No matching module/action found
  return false;
}

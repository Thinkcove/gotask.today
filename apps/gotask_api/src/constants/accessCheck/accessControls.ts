// accessControls.ts

interface User {
  role?: {
    accessDetails?: {
      name: string;
      application: {
        access: string;
        actions: string[];  // actions as simple strings now
        fields?: { [action: string]: string[] }; // optional fields per action
      }[];
    }[];
  };
}

/**
 * Checks if the user has permission for the given appName and action.
 * If a field is specified, also checks if the user has permission for that field under the action.
 * 
 * @param user - the user object containing role and accessDetails
 * @param appName - the name of the access/application to check
 * @param action - the action string to check (e.g., "READ", "CREATE")
 * @param field - optional, the specific field under the action to check access for
 * @returns boolean indicating if the user has the requested permission
 */
export function hasAccess(
  user: User,
  appName: string,
  action: string,
  field?: string
): boolean {
  const accessDetails = user?.role?.accessDetails || [];

  for (const access of accessDetails) {
    for (const app of access.application) {
      if (app.access === appName && app.actions.includes(action)) {
        // If no field specified, return true immediately
        if (!field) return true;

        // If fields defined, check if the field is allowed for this action
        if (app.fields && app.fields[action] && app.fields[action].includes(field)) {
          return true;
        }
      }
    }
  }

  // If no matching permission found
  return false;
}

interface User {
  role?: {
    accessDetails?: {
      name: string;
      application: {
        access: string;
        actions: string[];
        restrictedFields?: {
          [action: string]: string[];
        };
      }[];
    }[];
  };
}

export function hasAccess(
  user: User,
  appName: string,
  action: string
): { hasAccess: boolean; restrictedFields: string[] } {
  const accessDetails = user?.role?.accessDetails || [];
  for (const access of accessDetails) {
    for (const app of access.application) {
      if (app.access === appName && app.actions.includes(action)) {
        const restrictedFields = (app.restrictedFields && app.restrictedFields[action]) || [];
        return { hasAccess: true, restrictedFields };
      }
    }
  }

  return { hasAccess: false, restrictedFields: [] };
}
interface User {
  role?: {
    access?: {
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
  const accessDetails = user?.role?.access || [];
  for (const access of accessDetails) {
    for (const app of access.application) {
      console.log("accessapplication", access.application)
      if (app.access === appName && app.actions.includes(action)) {
        const restrictedFields = (app.restrictedFields && app.restrictedFields[action]) || [];
        return { hasAccess: true, restrictedFields };
      }
    }
  }

  return { hasAccess: false, restrictedFields: [] };
}

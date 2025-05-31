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

  console.log("accessDetails", accessDetails);

  for (const access of accessDetails) {
    for (const app of access.application) {
      if (app.access === appName && app.actions.includes(action)) {
        const restrictedFields = (app.restrictedFields && app.restrictedFields[action]) || [];
        console.log("app.access", app.access);
        return { hasAccess: true, restrictedFields };
      }
    }
  }

  return { hasAccess: false, restrictedFields: [] };
}

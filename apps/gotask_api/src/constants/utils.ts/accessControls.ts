// utils/accessControl.ts

interface User {
  role?: {
    accessDetails?: {
      name: string;
      application: {
        access: string;
        actions: string[];
      }[];
    }[];
  };
}

export function hasAccess(user: User, appName: string, action: string): boolean {
  const accessDetails = user?.role?.accessDetails || [];
  for (const access of accessDetails) {
    for (const app of access.application) {
      if (app.access === appName && app.actions.includes(action)) {
        return true;
      }
    }
  }
  return false;
}

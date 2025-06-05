// permissions.ts
import { ActionType, ApplicationName } from "./authCheck";

export type AccessDetails = {
  id: string;
  name: string;
  application: {
    access: ApplicationName;
    actions: ActionType[];
    restrictedFields?: {
      [action in ActionType]?: string[];
    };
    _id: string;
  }[];
};

export const hasPermission = (
  accessDetails: AccessDetails[],
  applicationName: ApplicationName,
  action: ActionType
): boolean => {
  return accessDetails.some((detail) =>
    detail.application.some(
      (app) => app.access === applicationName && app.actions.includes(action)
    )
  );
};

export const getRestrictedFields = (
  accessDetails: AccessDetails[],
  applicationName: ApplicationName,
  action: ActionType
): string[] => {
  const app = accessDetails
    .flatMap((detail) => detail.application)
    .find((app) => app.access === applicationName);

  if (!app) return [];

  return app.restrictedFields?.[action] ?? [];
};

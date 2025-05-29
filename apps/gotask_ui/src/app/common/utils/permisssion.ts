import { ActionType, ApplicationName } from "./authCheck";

type AccessDetails = {
  id: string;
  name: string;
  application: {
    access: ApplicationName;
    actions: ActionType[]; // <- Types say it's always an array, but runtime says otherwise
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
      (app) =>
        app.access === applicationName &&
        Array.isArray(app.actions) &&
        app.actions.includes(action)
    )
  );
};

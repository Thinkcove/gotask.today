import { ActionType, ApplicationName } from "./authCheck";

type AccessDetails = {
  id: string;
  name: string;
  application: {
    access: ApplicationName;
    actions: ActionType[];
    _id: string;
  }[];
};

export const hasPermission = (
  accessDetails: AccessDetails[],
  applicationName: ApplicationName,
  action: ActionType
): boolean => {
  return accessDetails.some((detail) =>
    detail.application.some((app) => app.access === applicationName && app.actions.includes(action))
  );
};

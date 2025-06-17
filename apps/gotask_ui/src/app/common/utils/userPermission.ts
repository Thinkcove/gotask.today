import { useUser } from "@/app/userContext";
import { ActionType, ApplicationName } from "./permission";

type AccessDetails = {
  id: string;
  name: string;
  application: {
    access: ApplicationName;
    actions: ActionType[];
    _id: string;
    restrictedFields?: {
      [key in ActionType]?: string[];
    };
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

export const useUserPermission = () => {
  const { user } = useUser();
  const accessDetails = (user?.role?.accessDetails ?? []) as AccessDetails[];

  const canAccess = (application: ApplicationName, action: ActionType): boolean => {
    return hasPermission(accessDetails, application, action);
  };

  const isFieldRestricted = (
    application: ApplicationName,
    action: ActionType,
    fieldName: string
  ): boolean => {
    return accessDetails.some((detail) =>
      detail.application.some((app) => {
        if (app.access === application && app.actions.includes(action)) {
          const restrictedFields = app.restrictedFields?.[action] ?? [];
          return restrictedFields.includes(fieldName);
        }
        return false;
      })
    );
  };
  return { canAccess, isFieldRestricted };
};

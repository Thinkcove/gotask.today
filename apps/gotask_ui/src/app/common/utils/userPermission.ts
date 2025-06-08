import { useUser } from "@/app/userContext";
import { ActionType, ApplicationName } from "./authCheck";
import { hasPermission } from "./permisssion";

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
    for (const detail of accessDetails) {
      for (const app of detail.application) {
        if (app.access === application && app.actions.includes(action)) {
          const restricted = app.restrictedFields?.[action] ?? [];
          if (restricted.includes(fieldName)) {
            return true;
          }
        }
      }
    }
    return false;
  };
console.log("isFieldRestricted", isFieldRestricted);
  return { canAccess, isFieldRestricted };
};

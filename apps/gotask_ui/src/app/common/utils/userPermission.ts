import { useUser } from "@/app/userContext";
import { ActionType, ApplicationName } from "./authCheck";
import { hasPermission } from "./permisssion";

export const useUserPermission = () => {
  const { user } = useUser();
  const accessDetails = (user?.role?.access ?? []) as {
    id: string;
    name: string;
    application: {
      access: ApplicationName;
      actions: ActionType[];
      _id: string;
    }[];
  }[];

  const canAccess = (application: ApplicationName, action: ActionType): boolean => {
    return hasPermission(accessDetails, application, action);
  };

  return { canAccess };
};

// useUserPermission.ts
import { useUser } from "@/app/userContext";
import { ActionType, ApplicationName } from "./authCheck";
import {
  AccessDetails,
  hasPermission,
  getRestrictedFields,
} from "../utils/permisssion";

export const useUserPermission = () => {
  const { user } = useUser();
  const accessDetails = (user?.role?.access ?? []) as AccessDetails[];

  const canAccess = (application: ApplicationName, action: ActionType): boolean => {
    return hasPermission(accessDetails, application, action);
  };

  const getRestricted = (application: ApplicationName, action: ActionType): string[] => {
    return getRestrictedFields(accessDetails, application, action);
  };

  return { canAccess, getRestricted };
};

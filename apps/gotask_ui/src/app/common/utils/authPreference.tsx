import { useUser } from "@/app/userContext";

export const useExcludedFields = (moduleName: string): string[] => {
  const { user } = useUser();

  if (!user?.preferences) return []; // Return empty initially while loading preferences.

  const pref = user.preferences.find((p) => p.module_name === moduleName);
  console.log("pref", pref);
  return pref?.exclude_fields || [];
};

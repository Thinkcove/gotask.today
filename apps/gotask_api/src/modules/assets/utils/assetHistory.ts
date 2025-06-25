import { findUser } from "../../../domain/interface/user/userInterface";
import { IAsset } from "../../../domain/model/asset/asset";
import { formatDate } from "../../../constants/utils/common";
import { capitalizeFirstLetter, insertSpaceBeforeCapital } from "../../../constants/utils/regex";

export const generateAssetHistoryEntry = async (
  existingAsset: IAsset,
  updatedData: Partial<IAsset>
): Promise<string[]> => {
  const fieldsToCheck = Object.keys(updatedData);

  const formatValue = (val: any) => {
    if (val instanceof Date) return formatDate(val);
    if (typeof val === "boolean") return val ? "Yes" : "No";
    return val ?? "N/A";
  };

  const historyEntries = await Promise.all(
    fieldsToCheck.map(async (field) => {
      if (field === "userid") return;
      const oldVal = existingAsset[field];
      const newVal = updatedData[field];

      const isDateField = oldVal instanceof Date || newVal instanceof Date;
      const isChanged = isDateField
        ? new Date(oldVal).getTime() !== new Date(newVal).getTime()
        : (oldVal ?? "") !== (newVal ?? "");

      if (!isChanged) return null;

      if (field === "userId") {
        if (!updatedData?.isAssignedToUpdated) return null;
        const newUser = await findUser(newVal);
        const newName = newUser?.name ?? "N/A";
        const oldName = updatedData.previouslyUsedBy;

        return oldName
          ? `User has been updated from "${oldName}" to "${newName}".`
          : `User has been updated to "${newName}".`;
      }

      if (field === "tag" || field === "previouslyUsedBy" || field === "isAssignedToUpdated")
        return null;

      const label = capitalizeFirstLetter(field.replace(insertSpaceBeforeCapital, " $1"));

      if (oldVal === undefined || oldVal === null || oldVal === "") {
        return `${label} has been updated to "${formatValue(newVal)}".`;
      }

      return `${label} has been updated from "${formatValue(oldVal)}" to "${formatValue(newVal)}".`;
    })
  );

  return historyEntries.filter(Boolean) as string[];
};

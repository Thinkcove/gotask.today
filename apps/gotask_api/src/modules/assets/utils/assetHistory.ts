import { findUser } from "../../../domain/interface/user/userInterface";
import { IAsset } from "../../../domain/model/asset/asset";
import { formatDate } from "../../../constants/utils/common";

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
      const oldVal = existingAsset[field];
      const newVal = updatedData[field];
      // Ignore if unchanged
      const isDateField = oldVal instanceof Date || newVal instanceof Date;
      const isChanged = isDateField
        ? new Date(oldVal).getTime() !== new Date(newVal).getTime()
        : (oldVal ?? "") !== (newVal ?? "");

      if (!isChanged) return null;

      // Custom logic for userId field
      if (field === "userId") {
        const [oldUser, newUser] = await Promise.all([findUser(oldVal), findUser(newVal)]);

        const oldName = oldUser?.name;
        const newName = newUser?.name;

        if (oldName) {
          return `User has been updated from "${oldName}" to "${newName}".`;
        } else {
          return `User has been updated to "${newName}".`;
        }
      }

      // Custom logic for tag field – omit tag-related changes
      if (field === "tag") {
        return null;
      }

      const label = field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

      return `${label} has been updated from "${formatValue(oldVal)}" to "${formatValue(newVal)}".`;
    })
  );

  return historyEntries.filter(Boolean) as string[];
};

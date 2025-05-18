import { UserPreference } from "../../domain/model/userPreference/userPreference";

const saveUserPreferences = async (user_id: string, preferences: any[]) => {
  const updated = await UserPreference.findOneAndUpdate(
    { user_id },
    { user_id, preferences },
    { upsert: true, new: true }
  );
  return updated;
};

const fetchUserPreferences = async (user_id: string) => {
  const result = await UserPreference.findOne({ user_id });
  return result || { user_id, preferences: [] };
};

export { saveUserPreferences, fetchUserPreferences };

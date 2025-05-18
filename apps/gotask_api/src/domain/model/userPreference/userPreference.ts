// models/userPreference.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IModulePreference {
  module_name: string;
  exclude_fields: string[];
}

export interface IUserPreference extends Document {
  user_id: string;
  preferences: IModulePreference[];
}

const ModulePreferenceSchema = new Schema<IModulePreference>({
  module_name: { type: String, required: true },
  exclude_fields: { type: [String], default: [] }
});

const UserPreferenceSchema = new Schema<IUserPreference>({
  user_id: { type: String, required: true, unique: true },
  preferences: { type: [ModulePreferenceSchema], default: [] }
});

export const UserPreference = mongoose.model<IUserPreference>(
  "UserPreference",
  UserPreferenceSchema
);

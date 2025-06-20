import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISkillMaster extends Document {
  id: string;
  name: string;
}

const SkillMasterSchema = new Schema<ISkillMaster>(
  {
    id: {
      type: String,
      default: uuidv4
    },
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    _id: false,
    timestamps: true
  }
);

export const SkillMaster = model<ISkillMaster>("SkillMaster", SkillMasterSchema);

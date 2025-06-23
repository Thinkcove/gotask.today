import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISkill {
  skill_id: string;
  name: string;
  proficiency: number; // 1–4
  experience?: number; // Required if proficiency is 3 or 4
}

export const SkillSchema = new Schema<ISkill>(
  {
    skill_id: {
      type: String,
      default: uuidv4
    },
    name: { type: String, required: true },
    proficiency: {
      type: Number,
      required: true,
      min: 1,
      max: 4
    },
    experience: {
      type: Number,
      required: function (this: ISkill) {
        return this.proficiency >= 3;
      }
    }
  },
  { _id: false }
);

export const Skill = model<ISkill>("Skill", SkillSchema);

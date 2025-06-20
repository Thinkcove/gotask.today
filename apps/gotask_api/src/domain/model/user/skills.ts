import { model, Schema } from "mongoose";

export interface ISkill {
  name: string;
  proficiency: number; // 1–4
  experience?: number; // Required if proficiency is 3 or 4
}

export const SkillSchema = new Schema<ISkill>(
  {
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

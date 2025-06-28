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
    timestamps: true
  }
);
SkillMasterSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});
export const SkillMaster = model<ISkillMaster>("SkillMaster", SkillMasterSchema);

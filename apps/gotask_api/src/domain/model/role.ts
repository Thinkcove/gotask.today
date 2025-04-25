import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IRole } from "../interface/role/roleInterface";


const RoleSchema = new Schema<IRole>(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true, unique: true },
    priority: { type: Number, required: true },
    access: [
      {
        type: String,
        required: true
      }
    ]
  },
  { timestamps: true }
);

export const Role = model<IRole>("Role", RoleSchema);

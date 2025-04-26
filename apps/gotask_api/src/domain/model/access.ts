import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IAccess } from "../interface/access/accessInterface";

const AccessSchema = new Schema<IAccess>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    application: [
      {
        access: { type: String, required: true },
        actions: [{ type: String, required: true }]
      }
    ]
  },
  { timestamps: true }
);

export const Access = mongoose.model<IAccess>("Access", AccessSchema);

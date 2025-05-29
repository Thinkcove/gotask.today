import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IApplication {
  access: string;
  actions: string[]; // array of string actions (e.g. ["READ", "CREATE"])
  fields: { [action: string]: string[] }; // map action -> allowed fields
}

export interface IAccess extends Document {
  id: string;
  name: string;
  application: IApplication[];
}

const ApplicationSchema = new Schema<IApplication>(
  {
    access: { type: String, required: true },
    actions: {
      type: [String], // just an array of strings
      required: true,
      default: []
    },
    fields: {
      type: Map,
      of: [String],
      required: true,
      default: {}
    }
  },
  { _id: false }
);

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
    application: [ApplicationSchema]
  },
  { timestamps: true }
);

export const Access = mongoose.model<IAccess>("Access", AccessSchema);

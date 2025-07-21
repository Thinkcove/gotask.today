import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IIncrementHistory {
  increment_id: string;
  date: Date;
  ctc: number;
}

export const IncrementSchema = new Schema<IIncrementHistory>(
  {
    increment_id: {
      type: String,
      default: uuidv4
    },
    date: { type: Date, required: true },
    ctc: { type: Number, required: true }
  },
  { _id: false }
);

export const Increment = model<IIncrementHistory>("Increment", IncrementSchema);

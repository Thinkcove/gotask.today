import { model, Schema } from "mongoose";

export interface IIncrementHistory {
  date: Date;
  ctc: number;
}

export const IncrementSchema = new Schema<IIncrementHistory>(
  {
    date: { type: Date, required: true },
    ctc: { type: Number, required: true }
  },
  { _id: false }
);

export const Increment = model<IIncrementHistory>("Increment", IncrementSchema);

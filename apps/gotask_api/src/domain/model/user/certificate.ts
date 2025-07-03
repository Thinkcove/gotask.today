import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICertificate {
  _id: string;
  name: string;
  obtained_date: Date;
  notes?: string;
}

export const CertificateSchema = new Schema<ICertificate>(
  {
    _id: {
      type: String,
      default: uuidv4
    },
    name: { type: String, required: true },
    obtained_date: { type: Date, required: true },
    notes: { type: String }
  },
  {
    _id: true
  }
);

export const Certificate = model<ICertificate>("Certificate", CertificateSchema);

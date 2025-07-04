import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICertificate {
  certificate_id: string;
  name: string;
  obtained_date: Date;
  notes?: string;
}

export const CertificateSchema = new Schema<ICertificate>(
  {
    certificate_id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true
    },
    name: { type: String, required: true },
    obtained_date: { type: Date, required: true },
    notes: { type: String }
  },
  {
    _id: false
  }
);

export const Certificate = model<ICertificate>("Certificate", CertificateSchema);

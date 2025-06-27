import { model, Schema } from "mongoose";

export interface ICertificate {
  name: string;
  obtained_date: Date;
  notes?: string;
}

export const CertificateSchema = new Schema<ICertificate>(
  {
    name: { type: String, required: true },
    obtained_date: { type: Date, required: true },
    notes: { type: String }
  },
  { _id: false }
);

export const Certificate = model<ICertificate>("Certificate", CertificateSchema);

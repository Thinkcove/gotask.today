import { model, Schema } from "mongoose";

export interface ICertificate {
  name: string;
  obtained_date: Date;
  notes?: string;
  link?: string;
}

export const CertificateSchema = new Schema<ICertificate>(
  {
    name: { type: String, required: true },
    obtained_date: { type: Date, required: true },
    notes: { type: String },
    link: { type: String }
  },
  { _id: false }
);

export const Certificate = model<ICertificate>("Certificate", CertificateSchema);

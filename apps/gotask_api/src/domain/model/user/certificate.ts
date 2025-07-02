import { model, Schema } from "mongoose";

export interface ICertificate {
  _id: any;
  name: string;
  obtained_date: Date;
  notes?: string;
}

export const CertificateSchema = new Schema<ICertificate>(
  {
    name: { type: String, required: true },
    obtained_date: { type: Date, required: true },
    notes: { type: String }
  }
);

export const Certificate = model<ICertificate>("Certificate", CertificateSchema);

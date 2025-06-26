import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICertificateMaster extends Document {
  id: string;
  name: string;
}

const CertificateMasterSchema = new Schema<ICertificateMaster>(
  {
    id: {
      type: String,
      default: uuidv4
    },
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

CertificateMasterSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export const CertificateMaster = model<ICertificateMaster>(
  "CertificateMaster",
  CertificateMasterSchema
);

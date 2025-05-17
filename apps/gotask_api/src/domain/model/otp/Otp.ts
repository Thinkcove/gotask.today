import { Schema, model, Document, Types } from "mongoose";

export interface IOtp extends Document {
  user: Types.ObjectId;    // Reference to User
  otp: string;
  otpExpiry: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // one OTP per user at a time (optional)
    },
    otp: {
      type: String,
      required: true
    },
    otpExpiry: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Otp = model<IOtp>("Otp", OtpSchema);

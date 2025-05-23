import { Schema, model, Document, Types } from "mongoose";

export interface IOtp extends Document {
  user: Types.ObjectId;
  otp: string;
  otpExpiry: Date;
  isUsed: boolean;
  attemptsLeft: number;
  resendCooldownExpiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    otpExpiry: {
      type: Date,
      required: true
    },
    isUsed: {
      type: Boolean,
      default: false
    },
    attemptsLeft: {
      type: Number,
      default: 5
    },
    resendCooldownExpiresAt: {
      type: Date,
      default: () => new Date(0)
    }
  },
  {
    timestamps: true
  }
);

// Auto-delete expired OTPs
OtpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

export const Otp = model<IOtp>("Otp", OtpSchema);

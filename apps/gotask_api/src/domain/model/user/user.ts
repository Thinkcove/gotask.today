import { Document, Schema, model, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

// Interface for the User document
export interface IUser extends Document {
  id: string;
  name: string;
  password: string;
  user_id: string;
  status: boolean;
  roleId: Types.ObjectId;
  organization?: string[];
  projects?: string[];
  otp?: string | null;
  otpExpiry?: Date | null;
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    user_id: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true },

    // Reference to Role
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },

    // Optional organizations and projects
    organization: {
      type: [String],
      default: []
    },
    projects: {
      type: [String],
      default: []
    },

    // OTP and expiry fields
    otp: {
      type: String,
      default: null
    },
    otpExpiry: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Password hashing before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = model<IUser>("User", UserSchema);

import { Document } from "mongoose";
import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  id: string;
  name: string;
  password: string;
  user_id: string; // Email ID
  status: boolean; // true = active, false = inactive/blocked
  role: string;
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, default: uuidv4, unique: true }, // Auto-generated UUID
    name: { type: String, required: true },
    password: { type: String, required: true },
    user_id: { type: String, required: true, unique: true }, // Email as unique ID
    status: { type: Boolean, default: true }, // Default: Active
    role: { type: String, required: true }
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model<IUser>("User", UserSchema);

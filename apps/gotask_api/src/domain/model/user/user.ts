import { Schema, model, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { IUser } from "../../interface/user/userInterface";

// User schema
const UserSchema = new Schema<IUser>(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    user_id: { type: String, required: true, unique: true },
    status: { type: Boolean, default: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },

    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null
    },
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project"
      }
    ]
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = model<IUser>("User", UserSchema);

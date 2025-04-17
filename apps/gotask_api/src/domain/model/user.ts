import { Document, Schema, model, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

// User interface
export interface IUser extends Document {
  id: string;
  name: string;
  password: string;
  user_id: string; // email
  status: boolean;
  role: string;
  organization?: Types.ObjectId;
  projects?: Types.ObjectId[];
}

// User schema
const UserSchema = new Schema<IUser>(
  {
    id: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    user_id: { type: String, required: true, unique: true }, // Email
    status: { type: Boolean, default: true },
    role: { type: String, required: true, ref: "Role" },

    // 🏢 Organization Reference (Optional)
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null
    },

    // 📁 Projects Reference (Optional array)
    projects: [{
      type: Schema.Types.ObjectId,
      ref: "Project"
    }]
  },
  { timestamps: true }
);

// Password hash hook
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Export model
export const User = model<IUser>("User", UserSchema);

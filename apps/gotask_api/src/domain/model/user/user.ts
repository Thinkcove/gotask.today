import { Document, Schema, model, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ALPHANUMERIC_REGEX } from "../../../constants/utils/regex";

// Interface for the User document
export interface IUser extends Document {
  id: string;
  first_name: string;
  last_name: string;
  emp_id?: string;
  name: string;
  user_id: string;
  mobile_no: string;
  joined_date: Date;
  status: boolean;
  roleId: Types.ObjectId;
  organization?: string[];
  projects?: string[];
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    id: { type: String, default: uuidv4, unique: true },
    emp_id: {
      type: String,
      unique: true,
      sparse: true,
      required: false,
      set: (v: string) => (v === "" ? undefined : v), //  convert "" to undefined
      validate: {
        validator: function (v: string) {
          if (!v) return true; // allow undefined/null
          return ALPHANUMERIC_REGEX.test(v);
        },
        message: (props) => `${props.value} is not valid! Only letters and numbers allowed.`
      }
    },
    name: { type: String, required: true },
    user_id: { type: String, required: true, unique: true },
    mobile_no: { type: String, required: true },
    joined_date: { type: Date, requied: true },
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
    }
  },
  {
    timestamps: true
  }
);

export const User = model<IUser>("User", UserSchema);

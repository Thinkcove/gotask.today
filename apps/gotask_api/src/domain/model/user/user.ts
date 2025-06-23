import { Document, Schema, model, Types } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ALPHANUMERIC_REGEX } from "../../../constants/utils/regex";
import { ISkill, SkillSchema } from "./skills";
import { CertificateSchema, ICertificate } from "./certificate";
import { IIncrementHistory, IncrementSchema } from "./increment";

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
  skills?: ISkill[];
  certificates?: ICertificate[];
  increment_history?: IIncrementHistory[];
}

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
      set: (v: string) => (v === "" ? undefined : v),
      validate: {
        validator: function (v: string) {
          if (!v) return true;
          return ALPHANUMERIC_REGEX.test(v);
        },
        message: (props) => `${props.value} is not valid! Only letters and numbers allowed.`
      }
    },
    name: { type: String, required: true },
    user_id: { type: String, required: true, unique: true },
    mobile_no: { type: String, required: true },
    joined_date: { type: Date, required: true },
    status: { type: Boolean, default: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    organization: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    skills: {
      type: [SkillSchema],
      default: []
    },
    certificates: { type: [CertificateSchema] },
    increment_history: { type: [IncrementSchema] }
  },
  {
    timestamps: true
  }
);

export const User = model<IUser>("User", UserSchema);

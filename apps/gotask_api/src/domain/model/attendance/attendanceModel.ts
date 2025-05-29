import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAttendance extends Document {
  id: string;
  empcode: string;
  empname: string;
  date: Date;
  inTime: string;
  outTime: string;
  status: string;
  minutesLate: number;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },
    empcode: {
      type: String,
      required: true,
      ref: "User" // Reference to User.empcode
    },
    empname: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    inTime: {
      type: String,
      required: true
    },
    outTime: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    minutesLate: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Create index for efficient querying
attendanceSchema.index({ empcode: 1, date: 1 });

// Transform toJSON to exclude _id and __v
attendanceSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});

export const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);

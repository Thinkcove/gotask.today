import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Attendance } from "../../model/attendance/attendanceModel";

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

export const createNewAttendance = async (attendanceData: IAttendance): Promise<IAttendance> => {
  const newAttendance = new Attendance(attendanceData);
  return await newAttendance.save();
};

export const findAttendanceByEmpcodeAndDate = async (
  empcode: string,
  date: Date
): Promise<IAttendance | null> => {
  return await Attendance.findOne({
    empcode,
    date: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lte: new Date(date.setHours(23, 59, 59, 999))
    }
  });
};

export const findAttendancesByQuery = async (query: any): Promise<IAttendance[]> => {
  return await Attendance.find(query).sort({ date: 1 });
};

export const createManyAttendances = async (records: IAttendance[]): Promise<IAttendance[]> => {
  return await Attendance.insertMany(records);
};

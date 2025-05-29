import { Attendance, IAttendance } from "../../model/attendance/attendanceModel";

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

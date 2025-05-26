import moment from "moment";
import fs from "fs";
import XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import {
  createNewAttendance,
  findAttendanceByEmpcodeAndDate,
  findAttendancesByQuery,
  IAttendance
} from "../../domain/interface/attendance/attendanceInterface";
import { User } from "../../domain/model/user/user";
import { ExtendedParsedQuery } from "../../domain/interface/query/queryInterface";
import { Attendance } from "../../domain/model/attendance/attendanceModel";
import { AttendanceMessages } from "../../constants/apiMessages/attendanceMessage";

export const addAttendance = async (
  empname: string,
  empcode: string,
  date: Date,
  inTime: string,
  outTime: string
): Promise<{ success: boolean; data?: IAttendance; message?: string }> => {
  try {
    if (!empcode || !date || !inTime || !outTime) {
      return { success: false, message: AttendanceMessages.CREATE.REQUIRED };
    }

    const user = await User.findOne({ user_id: empcode }).lean();
    if (!user) {
      return { success: false, message: `No employee found with empcode: ${empcode}` };
    }

    const empname = user.name;

    const inTimeMoment = moment(inTime, ["HH:mm:ss", "HH:mm"], true);
    if (!inTimeMoment.isValid()) {
      return { success: false, message: `Invalid inTime format: ${inTime}` };
    }

    const standardInTime = moment("09:00", "HH:mm");
    const minutesLate = inTimeMoment.isAfter(standardInTime)
      ? inTimeMoment.diff(standardInTime, "minutes")
      : 0;
    const status = minutesLate > 0 ? "Late" : inTime === "00:00" ? "Absent" : "Present";

    const existingRecord = await findAttendanceByEmpcodeAndDate(empcode, date);
    if (existingRecord) {
      return {
        success: false,
        message: `Attendance record already exists for ${empcode} on ${moment(date).format("YYYY-MM-DD")}`
      };
    }

    const attendanceData: IAttendance = {
      id: uuidv4(),
      empcode,
      empname,
      date: moment(date).startOf("day").toDate(),
      inTime,
      outTime,
      status,
      minutesLate
    } as IAttendance;

    const newAttendance = await createNewAttendance(attendanceData);

    return {
      success: true,
      data: newAttendance,
      message: `Attendance added for ${empname} on ${moment(date).format("YYYY-MM-DD")}`
    };
  } catch (error: any) {
    return { success: false, message: error.message || AttendanceMessages.CREATE.FAILED };
  }
};

// export const uploadAttendance = async (
//   filePath: string
// ): Promise<{
//   success: boolean;
//   data?: { inserted: number; skipped: number; errors: string[] };
//   message?: string;
// }> => {
//   try {
//     if (!fs.existsSync(filePath)) {
//       return {
//         success: false,
//         message: `File not found: ${filePath}`,
//         data: { inserted: 0, skipped: 0, errors: [`File not found: ${filePath}`] }
//       };
//     }

//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     if (rows.length < 2) {
//       return {
//         success: false,
//         message: "XLSX file is empty or has no data rows",
//         data: { inserted: 0, skipped: 0, errors: ["No data rows found"] }
//       };
//     }

//     const headers = rows[0] as string[];
//     const dataRows = rows.slice(1);

//     const records: IAttendance[] = [];
//     const errors: string[] = [];

//     for (let i = 0; i < dataRows.length; i++) {
//       const row = dataRows[i];
//       try {
//         const rowData: { [key: string]: any } = {};
//         headers.forEach((header, index) => {
//           rowData[header] = row[index] !== undefined ? String(row[index]).trim() : "";
//         });

//         if (
//           !rowData.empcode ||
//           !rowData.empname ||
//           !rowData.date ||
//           !rowData.inTime ||
//           !rowData.outTime
//         ) {
//           errors.push(`Missing fields for empcode ${rowData.empcode || "unknown"} at row ${i + 2}`);
//           continue;
//         }

//         const date = moment(rowData.date, ["YYYY-MM-DD", "DD-MM-YYYY"], true);
//         if (!date.isValid()) {
//           errors.push(`Invalid date format for empcode ${rowData.empcode} at row ${i + 2}`);
//           continue;
//         }

//         const inTimeMoment = moment(rowData.inTime, ["HH:mm:ss", "HH:mm"], true);
//         if (!inTimeMoment.isValid()) {
//           errors.push(`Invalid inTime format for empcode ${rowData.empcode} at row ${i + 2}`);
//           continue;
//         }

//         const outTimeMoment = moment(rowData.outTime, ["HH:mm:ss", "HH:mm"], true);
//         if (!outTimeMoment.isValid()) {
//           errors.push(`Invalid outTime format for empcode ${rowData.empcode} at row ${i + 2}`);
//           continue;
//         }

//         const user = await User.findOne({
//           user_id: rowData.empcode,
//           name: { $regex: `^${rowData.empname}$`, $options: "i" }
//         }).lean();
//         if (!user) {
//           errors.push(
//             `Invalid empcode ${rowData.empcode} or empname ${rowData.empname} at row ${i + 2}`
//           );
//           continue;
//         }

//         const standardInTime = moment("09:00", "HH:mm");
//         const minutesLate = inTimeMoment.isAfter(standardInTime)
//           ? inTimeMoment.diff(standardInTime, "minutes")
//           : 0;
//         const status = minutesLate > 0 ? "Late" : rowData.inTime === "00:00" ? "Absent" : "Present";

//         const attendanceData: IAttendance = {
//           id: uuidv4(),
//           empcode: rowData.empcode,
//           empname: user.name,
//           date: date.startOf("day").toDate(),
//           inTime: rowData.inTime,
//           outTime: rowData.outTime,
//           status,
//           minutesLate
//         } as IAttendance;

//         records.push(attendanceData);
//       } catch (err) {
//         errors.push(
//           `Error processing row ${i + 2} for empcode ${rowData.empcode || "unknown"}: ${(err as Error).message}`
//         );
//       }
//     }

//     if (records.length === 0 && errors.length > 0) {
//       return {
//         success: false,
//         data: { inserted: 0, skipped: 0, errors },
//         message: "No valid attendance records processed"
//       };
//     }

//     let insertedCount = 0;
//     let skippedCount = 0;
//     for (const record of records) {
//       try {
//         const existingRecord = await Attendance.findOne({
//           empcode: record.empcode,
//           date: record.date
//         }).lean();
//         if (existingRecord) {
//           errors.push(
//             `Attendance record already exists for ${record.empcode} on ${moment(record.date).format("YYYY-MM-DD")}`
//           );
//           skippedCount++;
//           continue;
//         }

//         await Attendance.create(record);
//         insertedCount++;
//       } catch (err) {
//         errors.push(
//           `Error inserting record for empcode ${record.empcode}: ${(err as Error).message}`
//         );
//         skippedCount++;
//       }
//     }

//     return {
//       success: true,
//       data: { inserted: insertedCount, skipped: skippedCount, errors },
//       message: "Attendance records processed successfully"
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       message: error.message || AttendanceMessages.UPLOAD.FAILED,
//       data: { inserted: 0, skipped: 0, errors: [error.message || AttendanceMessages.UPLOAD.FAILED] }
//     };
//   }
// };

export const uploadAttendance = async (
  filePath: string
): Promise<{
  success: boolean;
  data?: { inserted: number; skipped: number; errors: string[] };
  message?: string;
}> => {
  try {
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        message: `File not found: ${filePath}`,
        data: { inserted: 0, skipped: 0, errors: [`File not found: ${filePath}`] }
      };
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (rows.length < 2) {
      return {
        success: false,
        message: "XLSX file is empty or has no data rows",
        data: { inserted: 0, skipped: 0, errors: ["No data rows found"] }
      };
    }

    const headers = rows[0] as string[];
    const dataRows = rows.slice(1);

    const records: IAttendance[] = [];
    const errors: string[] = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      let rowData: { [key: string]: any } = {}; // Declare outside try
      try {
        headers.forEach((header, index) => {
          rowData[header] = row[index] !== undefined ? String(row[index]).trim() : "";
        });

        if (
          !rowData.empcode ||
          !rowData.empname ||
          !rowData.date ||
          !rowData.inTime ||
          !rowData.outTime
        ) {
          errors.push(`Missing fields for empcode ${rowData.empcode || "unknown"} at row ${i + 2}`);
          continue;
        }

        const date = moment(rowData.date, ["YYYY-MM-DD", "DD-MM-YYYY"], true);
        if (!date.isValid()) {
          errors.push(`Invalid date format for empcode ${rowData.empcode} at row ${i + 2}`);
          continue;
        }

        const inTimeMoment = moment(rowData.inTime, ["HH:mm:ss", "HH:mm"], true);
        if (!inTimeMoment.isValid()) {
          errors.push(`Invalid inTime format for empcode ${rowData.empcode} at row ${i + 2}`);
          continue;
        }

        const outTimeMoment = moment(rowData.outTime, ["HH:mm:ss", "HH:mm"], true);
        if (!outTimeMoment.isValid()) {
          errors.push(`Invalid outTime format for empcode ${rowData.empcode} at row ${i + 2}`);
          continue;
        }

        const user = await User.findOne({
          user_id: rowData.empcode,
          name: { $regex: `^${rowData.empname}$`, $options: "i" }
        }).lean();
        if (!user) {
          errors.push(
            `Invalid empcode ${rowData.empcode} or empname ${rowData.empname} at row ${i + 2}`
          );
          continue;
        }

        const standardInTime = moment("09:00", "HH:mm");
        const minutesLate = inTimeMoment.isAfter(standardInTime)
          ? inTimeMoment.diff(standardInTime, "minutes")
          : 0;
        const status = minutesLate > 0 ? "Late" : rowData.inTime === "00:00" ? "Absent" : "Present";

        const attendanceData: IAttendance = {
          id: uuidv4(),
          empcode: rowData.empcode,
          empname: user.name,
          date: date.startOf("day").toDate(),
          inTime: rowData.inTime,
          outTime: rowData.outTime,
          status,
          minutesLate
        } as IAttendance;

        records.push(attendanceData);
      } catch (err) {
        errors.push(
          `Error processing row ${i + 2} for empcode ${
            rowData.empcode || "unknown"
          }: ${(err as Error).message}`
        );
      }
    }

    if (records.length === 0 && errors.length > 0) {
      return {
        success: false,
        data: { inserted: 0, skipped: 0, errors },
        message: "No valid attendance records processed"
      };
    }

    let insertedCount = 0;
    let skippedCount = 0;
    for (const record of records) {
      try {
        const existingRecord = await Attendance.findOne({
          empcode: record.empcode,
          date: record.date
        }).lean();
        if (existingRecord) {
          errors.push(
            `Attendance record already exists for ${record.empcode} on ${moment(record.date).format(
              "YYYY-MM-DD"
            )}`
          );
          skippedCount++;
          continue;
        }

        await Attendance.create(record);
        insertedCount++;
      } catch (err) {
        errors.push(
          `Error inserting record for empcode ${record.empcode}: ${(err as Error).message}`
        );
        skippedCount++;
      }
    }

    return {
      success: true,
      data: { inserted: insertedCount, skipped: skippedCount, errors },
      message: "Attendance records processed successfully"
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || AttendanceMessages.UPLOAD.FAILED,
      data: {
        inserted: 0,
        skipped: 0,
        errors: [error.message || AttendanceMessages.UPLOAD.FAILED]
      }
    };
  }
};

export const processQuery = async (
  query: string,
  parsedQuery: ExtendedParsedQuery
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    if (parsedQuery.keywords?.includes("absent")) {
      let startDate: moment.Moment;
      let endDate: moment.Moment;
      if (parsedQuery.timeRange === "last week") {
        startDate = moment().subtract(1, "week").startOf("week");
        endDate = moment().subtract(1, "week").endOf("week");
      } else {
        startDate = parsedQuery.dates?.[0]
          ? moment(parsedQuery.dates[0]).startOf("day")
          : moment().startOf("day");
        endDate = startDate;
      }

      if (startDate.day() === 0 && startDate.isSame(endDate, "day")) {
        return { success: true, message: "No absences tracked on Sundays" };
      }

      const records = await findAttendancesByQuery({
        date: { $gte: startDate.toDate(), $lte: endDate.endOf("day").toDate() },
        status: "Absent"
      });

      if (!records.length) {
        const message =
          parsedQuery.timeRange === "last week"
            ? `No employees were absent last week (${startDate.format("YYYY-MM-DD")} to ${endDate.format("YYYY-MM-DD")})`
            : `No employees were absent on ${startDate.format("YYYY-MM-DD")}`;
        return { success: true, message };
      }

      const names = [...new Set(records.map((r: any) => r.empname))].join(", ");
      const message =
        parsedQuery.timeRange === "last week"
          ? `Absent last week (${startDate.format("YYYY-MM-DD")} to ${endDate.format("YYYY-MM-DD")}): ${names}`
          : `Absent on ${startDate.format("YYYY-MM-DD")}: ${names}`;
      return { success: true, message };
    }

    if (parsedQuery.after10am) {
      const date = parsedQuery.dates?.[0]
        ? moment(parsedQuery.dates[0]).startOf("day")
        : moment().startOf("day");
      if (date.day() === 0) {
        return { success: true, message: "No attendance tracked on Sundays" };
      }

      const records = await findAttendancesByQuery({
        date: { $gte: date.toDate(), $lte: date.endOf("day").toDate() },
        inTime: { $gte: "10:00" }
      });

      if (!records.length) {
        return {
          success: true,
          message: `No employees logged in after 10:00 AM on ${date.format("YYYY-MM-DD")}`
        };
      }

      const names = [...new Set(records.map((r: any) => r.empname))].join(", ");
      return {
        success: true,
        message: `Logged in after 10:00 AM on ${date.format("YYYY-MM-DD")}: ${names}`
      };
    }

    if (parsedQuery.latelogoff) {
      const date = parsedQuery.dates?.[0]
        ? moment(parsedQuery.dates[0]).startOf("day")
        : moment().startOf("day");
      if (date.day() === 0) {
        return { success: true, message: "No attendance tracked on Sundays" };
      }

      const records = await findAttendancesByQuery({
        date: { $gte: date.toDate(), $lte: date.endOf("day").toDate() },
        outTime: { $gte: "19:00" }
      });

      if (!records.length) {
        return {
          success: true,
          message: `No employees logged off after 7:00 PM on ${date.format("YYYY-MM-DD")}`
        };
      }

      const names = [...new Set(records.map((r: any) => r.empname))].join(", ");
      return {
        success: true,
        message: `Logged off after 7:00 PM on ${date.format("YYYY-MM-DD")}: ${names}`
      };
    }

    if (parsedQuery.keywords?.includes("late") && parsedQuery.timeRange === "last week") {
      const startDate = moment().subtract(1, "week").startOf("week");
      const endDate = moment().subtract(1, "week").endOf("week");

      const records = await findAttendancesByQuery({
        date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        minutesLate: { $gt: 0 }
      });

      if (!records.length) {
        return {
          success: true,
          message: `No employees were late last week (${startDate.format("YYYY-MM-DD")} to ${endDate.format("YYYY-MM-DD")})`
        };
      }

      const names = [...new Set(records.map((r: any) => r.empname))].join(", ");
      return {
        success: true,
        message: `Late last week (${startDate.format("YYYY-MM-DD")} to ${endDate.format("YYYY-MM-DD")}): ${names}`
      };
    }

    if (
      parsedQuery.keywords?.includes("late") &&
      parsedQuery.dates?.[0] &&
      !parsedQuery.empname &&
      !parsedQuery.empcode
    ) {
      const date = moment(parsedQuery.dates[0]).startOf("day");
      if (date.day() === 0) {
        return { success: true, message: "No attendance tracked on Sundays" };
      }

      const records = await findAttendancesByQuery({
        date: { $gte: date.toDate(), $lte: date.endOf("day").toDate() },
        minutesLate: { $gt: 0 }
      });

      if (!records.length) {
        return { success: true, message: `No employees were late on ${date.format("YYYY-MM-DD")}` };
      }

      const names = [...new Set(records.map((r: any) => r.empname))].join(", ");
      return { success: true, message: `Late on ${date.format("YYYY-MM-DD")}: ${names}` };
    }

    return {
      success: false,
      message:
        "Invalid attendance query: Please specify absent, after10am, latelogoff, late, or employee details"
    };
  } catch (error: any) {
    return { success: false, message: error.message || AttendanceMessages.QUERY.FAILED };
  }
};

export const processEmployeeQuery = async (
  query: string,
  parsedQuery: ExtendedParsedQuery
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    let name: string | undefined;
    let empcode: string | undefined;

    if (parsedQuery.empname) {
      const nameParts = parsedQuery.empname.trim().split(/\s+from\s+/i);
      name = nameParts[0].trim();
      const user = await User.findOne({ username: { $regex: `^${name}$`, $options: "i" } }).lean();
      if (!user) {
        return { success: false, message: `No attendance record found for employee ${name}` };
      }
      empcode = user.user_id;
      name = user.name;
    } else if (parsedQuery.empcode) {
      empcode = parsedQuery.empcode.trim();
      const user = await User.findOne({ user_id: empcode }).lean();
      if (!user) {
        return { success: false, message: `No attendance record found for empcode ${empcode}` };
      }
      name = user.name;
      empcode = user.user_id;
    }

    if (!empcode || !name) {
      return { success: false, message: `No valid employee identifier provided` };
    }

    let startDate: moment.Moment;
    let endDate: moment.Moment;
    if (parsedQuery.dateRange) {
      startDate = moment(parsedQuery.dateRange.start).isValid()
        ? moment(parsedQuery.dateRange.start).startOf("day")
        : moment(`${parsedQuery.dateRange.start}-2025`, "DD MMMM YYYY").startOf("day");
      endDate = moment(parsedQuery.dateRange.end).isValid()
        ? moment(parsedQuery.dateRange.end).endOf("day")
        : moment(`${parsedQuery.dateRange.end}-2025`, "DD MMMM YYYY").endOf("day");
    } else if (parsedQuery.dates && parsedQuery.dates[0]) {
      startDate = moment(parsedQuery.dates[0]).startOf("day");
      endDate = startDate;
    } else if (parsedQuery.timeRange === "last week") {
      startDate = moment().subtract(1, "week").startOf("week");
      endDate = moment().subtract(1, "week").endOf("week");
    } else {
      startDate = moment().startOf("month");
      endDate = moment().endOf("month");
    }

    const dateStr = parsedQuery.dateRange
      ? `from ${startDate.format("DD MMMM YYYY")} to ${endDate.format("DD MMMM YYYY")}`
      : parsedQuery.dates && parsedQuery.dates[0]
        ? moment(parsedQuery.dates[0]).format("DD MMMM YYYY")
        : parsedQuery.timeRange || "the specified period";

    const queryFilter: any = { empcode };
    if (parsedQuery.dateRange) {
      queryFilter.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
    } else if (parsedQuery.dates && parsedQuery.dates[0]) {
      queryFilter.date = { $gte: startDate.toDate(), $lte: startDate.endOf("day").toDate() };
    } else if (parsedQuery.timeRange === "last week") {
      queryFilter.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
    }

    const attendanceRecords = await findAttendancesByQuery(queryFilter);

    if (!attendanceRecords.length) {
      return { success: false, message: `No attendance records found for ${name} for ${dateStr}` };
    }

    const keywords = parsedQuery.keywords || [];

    if (keywords.includes("average") || parsedQuery.averageInTime || parsedQuery.averageOutTime) {
      const query: any = {
        empcode,
        status: { $ne: "Absent" },
        inTime: { $ne: "00:00" },
        outTime: { $ne: "00:00" }
      };

      if (parsedQuery.dateRange) {
        query.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
      } else if (parsedQuery.dates && parsedQuery.dates[0]) {
        query.date = { $gte: startDate.toDate(), $lte: startDate.endOf("day").toDate() };
      } else if (parsedQuery.timeRange === "last week") {
        query.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
      }

      const records = await findAttendancesByQuery(query);
      if (!records.length) {
        return {
          success: false,
          message: `${name} has no valid attendance records for ${dateStr}.`
        };
      }

      let avgInTime = "N/A";
      let avgOutTime = "N/A";

      if (parsedQuery.averageInTime || keywords.includes("average")) {
        const inTimes = records
          .map(
            (r: any) =>
              moment.utc(r.inTime, ["HH:mm:ss", "HH:mm"]).hour() +
              moment.utc(r.inTime, ["HH:mm:ss", "HH:mm"]).minute() / 60
          )
          .filter((t: any) => !isNaN(t));
        avgInTime = inTimes.length
          ? moment
              .utc((inTimes.reduce((a: any, b: any) => a + b, 0) / inTimes.length) * 60 * 60 * 1000)
              .format("h:mm A")
          : "N/A";
      }

      if (parsedQuery.averageOutTime) {
        const outTimes = records
          .map(
            (r: any) =>
              moment.utc(r.outTime, ["HH:mm:ss", "HH:mm"]).hour() +
              moment.utc(r.outTime, ["HH:mm:ss", "HH:mm"]).minute() / 60
          )
          .filter((t: any) => !isNaN(t));
        avgOutTime = outTimes.length
          ? moment
              .utc(
                (outTimes.reduce((a: any, b: any) => a + b, 0) / outTimes.length) * 60 * 60 * 1000
              )
              .format("h:mm A")
          : "N/A";
      }

      if (parsedQuery.averageInTime && !parsedQuery.averageOutTime) {
        return {
          success: true,
          message: `${name}'s average in-time is ${avgInTime} for ${dateStr}.`
        };
      }
      if (parsedQuery.averageOutTime && !parsedQuery.averageInTime) {
        return {
          success: true,
          message: `${name}'s average out-time is ${avgOutTime} for ${dateStr}.`
        };
      }
      return {
        success: true,
        message: `${name}'s average in-time is ${avgInTime} and out-time is ${avgOutTime} for ${dateStr}.`
      };
    }

    if (keywords.includes("intime") && keywords.includes("outtime")) {
      const record = attendanceRecords[0];
      if (!record.inTime && !record.outTime) {
        return {
          success: false,
          message: `${name} has no in-time or out-time recorded on ${dateStr}`
        };
      }
      const inTime = record.inTime || "Not recorded";
      const outTime = record.outTime || "Not recorded";
      return {
        success: true,
        message: `${name}'s in-time on ${dateStr} was ${inTime}, out-time was ${outTime}`
      };
    } else if (keywords.includes("intime")) {
      const record = attendanceRecords[0];
      if (!record.inTime) {
        return { success: false, message: `${name} has no in-time recorded on ${dateStr}` };
      }
      return { success: true, message: `${name}'s in-time on ${dateStr} was ${record.inTime}` };
    } else if (keywords.includes("outtime")) {
      const record = attendanceRecords[0];
      if (!record.outTime) {
        return { success: false, message: `${name} has no out-time recorded on ${dateStr}` };
      }
      return { success: true, message: `${name}'s out-time on ${dateStr} was ${record.outTime}` };
    } else if (keywords.includes("late") || parsedQuery.hoursLate) {
      const record = attendanceRecords[0];
      if (record.minutesLate === undefined || record.minutesLate === null) {
        return { success: false, message: `${name} has no late minutes recorded on ${dateStr}` };
      }
      return {
        success: true,
        message: `${name} was ${record.minutesLate} minutes late on ${dateStr}`
      };
    } else if (keywords.includes("absent")) {
      const record = attendanceRecords[0];
      if (!record.status) {
        return {
          success: false,
          message: `${name} has no attendance status recorded on ${dateStr}`
        };
      }
      const isAbsent = record.status.toLowerCase() === "absent";
      return {
        success: true,
        message: `${name} was ${isAbsent ? "absent" : "not absent"} on ${dateStr}`
      };
    } else if (keywords.includes("attendance")) {
      let response = `Attendance for ${name} ${dateStr}:\n`;
      attendanceRecords.forEach((record: any) => {
        const recordDate = moment(record.date).format("DD MMMM YYYY");
        response += `${recordDate}: Status=${record.status || "Not recorded"}, In=${record.inTime || "Not recorded"}, Out=${record.outTime || "Not recorded"}, Minutes Late=${record.minutesLate ?? "0"}\n`;
      });
      return { success: true, message: response.trim() };
    } else if (keywords.includes("workinghours")) {
      const record = attendanceRecords[0];
      if (!record.inTime || !record.outTime) {
        return { success: false, message: `${name} has incomplete attendance data on ${dateStr}` };
      }
      const inTime = moment(record.inTime, ["HH:mm:ss", "HH:mm"]);
      const outTime = moment(record.outTime, ["HH:mm:ss", "HH:mm"]);
      const hoursWorked = outTime.diff(inTime, "hours", true).toFixed(2);
      return { success: true, message: `${name} worked ${hoursWorked} hours on ${dateStr}` };
    } else if (keywords.includes("after10am")) {
      const record = attendanceRecords[0];
      if (!record.inTime) {
        return { success: false, message: `${name} has no in-time recorded on ${dateStr}` };
      }
      const inTime = moment(record.inTime, ["HH:mm:ss", "HH:mm"]);
      const isLate = inTime.isAfter(moment("10:00", "HH:mm"));
      return {
        success: true,
        message: `${name} ${isLate ? "logged in after 10:00 AM" : "did not log in after 10:00 AM"} on ${dateStr}`
      };
    } else if (keywords.includes("latelogoff")) {
      const record = attendanceRecords[0];
      if (!record.outTime) {
        return { success: false, message: `${name} has no out-time recorded on ${dateStr}` };
      }
      const outTime = moment(record.outTime, ["HH:mm:ss", "HH:mm"]);
      const isLate = outTime.isAfter(moment("19:00", "HH:mm"));
      return {
        success: true,
        message: `${name} ${isLate ? "logged off after 7:00 PM" : "did not log off after 7:00 PM"} on ${dateStr}`
      };
    }

    return { success: false, message: `Please specify a valid attendance query for ${name}` };
  } catch (error: any) {
    return { success: false, message: error.message || AttendanceMessages.QUERY.FAILED };
  }
};

export default {
  addAttendance,
  uploadAttendance,
  processQuery,
  processEmployeeQuery
};

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

export const processQuery = async (
  query: string,
  parsedQuery: Record<string, any>
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
  parsedQuery: Record<string, any>
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    // Log raw query and parsed query
    console.log("Raw Query:", query);
    console.log("Parsed Query:", JSON.stringify(parsedQuery, null, 2));

    let name: string | undefined;
    let empcode: string | undefined;

    // Step 1: Get empname or empcode
    if (parsedQuery.empname) {
      name = parsedQuery.empname
        .trim()
        .split(/\s+from\s+/i)[0]
        .trim();
      console.log(`Looking up Attendance for empname: ${name}`);
      const attendanceRecords = await findAttendancesByQuery({
        empname: { $regex: `^${name}$`, $options: "i" }
      });
      console.log(`Attendance records for empname: ${attendanceRecords.length}`);
      if (!attendanceRecords.length) {
        return { success: false, message: `No attendance record found for employee ${name}` };
      }
      empcode = attendanceRecords[0].empcode;
      // Validate empname against User.username
      const user = await User.findOne({ username: { $regex: `^${name}$`, $options: "i" } }).lean();
      console.log(`User found for username ${name}: ${!!user}`);
      if (!user) {
        return { success: false, message: `No user found with username ${name}` };
      }
    } else if (parsedQuery.empcode) {
      empcode = parsedQuery.empcode.trim();
      console.log(`Looking up Attendance for empcode: ${empcode}`);
      const attendanceRecords = await findAttendancesByQuery({ empcode });
      console.log(`Attendance records for empcode: ${attendanceRecords.length}`);
      if (!attendanceRecords.length) {
        return { success: false, message: `No attendance record found for empcode ${empcode}` };
      }
      name = attendanceRecords[0].empname;
      // Validate empname against User.username
      const user = await User.findOne({ username: { $regex: `^${name}$`, $options: "i" } }).lean();
      console.log(`User found for username ${name}: ${!!user}`);
      if (!user) {
        return { success: false, message: `No user found with username ${name}` };
      }
    } else {
      console.log("No empname or empcode provided");
      return { success: false, message: `No valid employee identifier provided` };
    }

    // Step 2: Handle dates
    let startDate: moment.Moment;
    let endDate: moment.Moment;
    if (parsedQuery.dateRange) {
      startDate = moment(
        parsedQuery.dateRange.start,
        ["DD MMMM YYYY", "DD-MM-YYYY", "MMMM DD"],
        true
      ).startOf("day");
      endDate = moment(
        parsedQuery.dateRange.end,
        ["DD MMMM YYYY", "DD-MM-YYYY", "MMMM DD"],
        true
      ).endOf("day");
      if (!startDate.isValid())
        startDate = moment(`${parsedQuery.dateRange.start}-2025`, [
          "DD MMMM YYYY",
          "DD-MM-YYYY"
        ]).startOf("day");
      if (!endDate.isValid())
        endDate = moment(`${parsedQuery.dateRange.end}-2025`, ["DD MMMM YYYY", "DD-MM-YYYY"]).endOf(
          "day"
        );
    } else if (parsedQuery.dates?.[0]) {
      startDate = moment(
        parsedQuery.dates[0],
        ["DD MMMM YYYY", "DD-MM-YYYY", "MMMM DD"],
        true
      ).startOf("day");
      if (!startDate.isValid())
        startDate = moment(`${parsedQuery.dates[0]}-2025`, ["DD MMMM YYYY", "DD-MM-YYYY"]).startOf(
          "day"
        );
      endDate = startDate;
    } else if (parsedQuery.timeRange === "last week") {
      startDate = moment().subtract(1, "week").startOf("week");
      endDate = moment().subtract(1, "week").endOf("week");
    } else {
      startDate = moment().startOf("month");
      endDate = moment().endOf("month");
    }

    console.log(`Date range: ${startDate.format("YYYY-MM-DD")} to ${endDate.format("YYYY-MM-DD")}`);
    if (!startDate.isValid() || !endDate.isValid()) {
      console.log("Invalid date format");
      return { success: false, message: `Invalid date format provided` };
    }

    const dateStr = parsedQuery.dateRange
      ? `from ${startDate.format("DD MMMM YYYY")} to ${endDate.format("DD MMMM YYYY")}`
      : parsedQuery.dates?.[0]
        ? startDate.format("DD MMMM YYYY")
        : parsedQuery.timeRange || "the specified period";

    // Step 3: Query attendance
    const queryFilter: any = { empcode, empname: name };
    if (parsedQuery.dateRange || parsedQuery.dates?.[0] || parsedQuery.timeRange === "last week") {
      queryFilter.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
    }

    console.log("Query filter:", JSON.stringify(queryFilter, null, 2));
    const attendanceRecords = await findAttendancesByQuery(queryFilter);
    console.log(`Final attendance records: ${attendanceRecords.length}`);

    if (!attendanceRecords.length) {
      return {
        success: false,
        message: `No attendance records found for ${name || empcode} for ${dateStr}`
      };
    }

    const keywords = parsedQuery.keywords || [];
    console.log("Keywords:", keywords);

    // Query Handlers
    // 1. Working hours (e.g., "What is the working hours of Supriya on 21 april?")
    if (keywords.includes("workinghours")) {
      const record = attendanceRecords[0];
      if (!record.inTime || !record.outTime) {
        return {
          success: false,
          message: `${name || empcode} has incomplete attendance data on ${dateStr}`
        };
      }
      const inTime = moment(record.inTime, ["HH:mm:ss", "HH:mm"]);
      const outTime = moment(record.outTime, ["HH:mm:ss", "HH:mm"]);
      if (!inTime.isValid() || !outTime.isValid()) {
        return {
          success: false,
          message: `Invalid time format for ${name || empcode} on ${dateStr}`
        };
      }
      const hoursWorked = outTime.diff(inTime, "hours", true).toFixed(2);
      return {
        success: true,
        message: `${name || empcode} worked ${hoursWorked} hours on ${dateStr}`
      };
    }

    // 2. Info (e.g., "Supriya info")
    if (keywords.includes("info")) {
      let response = `Attendance info for ${name || empcode} ${dateStr}:\n`;
      attendanceRecords.forEach((record: any) => {
        const recordDate = moment(record.date).format("DD MMMM YYYY");
        response += `${recordDate}: Status=${record.status || "Not recorded"}, In=${record.inTime || "Not recorded"}, Out=${record.outTime || "Not recorded"}, Minutes Late=${record.minutesLate ?? "0"}\n`;
      });
      return { success: true, message: response.trim() };
    }

    // 3. Absent (e.g., "2326 absent on 15th April 2025")
    if (keywords.includes("absent")) {
      const record = attendanceRecords[0];
      if (!record.status) {
        return {
          success: false,
          message: `${name || empcode} has no attendance status recorded on ${dateStr}`
        };
      }
      const isAbsent = record.status.toLowerCase() === "absent";
      return {
        success: true,
        message: `${name || empcode} was ${isAbsent ? "absent" : "not absent"} on ${dateStr}`
      };
    }

    // 4. Average in-time and out-time (e.g., "Supriya's average intime and average outtime")
    if (
      (parsedQuery.averageInTime && parsedQuery.averageOutTime) ||
      (keywords.includes("average") && keywords.includes("intime") && keywords.includes("outtime"))
    ) {
      const query: any = {
        empcode,
        empname: name,
        status: { $ne: "Absent" },
        inTime: { $ne: "00:00" },
        outTime: { $ne: "00:00" }
      };
      if (
        parsedQuery.dateRange ||
        parsedQuery.dates?.[0] ||
        parsedQuery.timeRange === "last week"
      ) {
        query.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
      }
      const records = await findAttendancesByQuery(query);
      if (!records.length) {
        return {
          success: false,
          message: `${name || empcode} has no valid attendance records for ${dateStr}`
        };
      }
      const inTimes = records
        .map((r: any) => {
          const time = moment.utc(r.inTime, ["HH:mm:ss", "HH:mm"]);
          return time.isValid() ? time.hour() * 3600 + time.minute() * 60 + time.second() : NaN;
        })
        .filter((t: number) => !isNaN(t));
      const outTimes = records
        .map((r: any) => {
          const time = moment.utc(r.outTime, ["HH:mm:ss", "HH:mm"]);
          return time.isValid() ? time.hour() * 3600 + time.minute() * 60 + time.second() : NaN;
        })
        .filter((t: number) => !isNaN(t));
      const avgInTime = inTimes.length
        ? moment
            .utc((inTimes.reduce((a: number, b: number) => a + b, 0) / inTimes.length) * 1000)
            .format("h:mm A")
        : "N/A";
      const avgOutTime = outTimes.length
        ? moment
            .utc((outTimes.reduce((a: number, b: number) => a + b, 0) / outTimes.length) * 1000)
            .format("h:mm A")
        : "N/A";
      return {
        success: true,
        message: `${name || empcode}'s average in-time is ${avgInTime} and out-time is ${avgOutTime} for ${dateStr}`
      };
    }

    // 5 & 6. Attendance/Show (e.g., "2334 attendance for 23th March", "Show 2334 attendance for 23th March")
    if (keywords.includes("attendance") || keywords.includes("show")) {
      let response = `Attendance for ${name || empcode} ${dateStr}:\n`;
      attendanceRecords.forEach((record: any) => {
        const recordDate = moment(record.date).format("DD MMMM YYYY");
        response += `${recordDate}: Status=${record.status || "Not recorded"}, In=${record.inTime || "Not recorded"}, Out=${record.outTime || "Not recorded"}, Minutes Late=${record.minutesLate ?? "0"}\n`;
      });
      return { success: true, message: response.trim() };
    }

    // 7. Minutes late (e.g., "How many minutes Sophiya late on 13-04-2025")
    if (keywords.includes("late") || parsedQuery.hoursLate) {
      const record = attendanceRecords[0];
      if (record.minutesLate === undefined || record.minutesLate === null) {
        return {
          success: false,
          message: `${name || empcode} has no late minutes recorded on ${dateStr}`
        };
      }
      return {
        success: true,
        message: `${name || empcode} was ${record.minutesLate} minutes late on ${dateStr}`
      };
    }

    // 8. In-time and out-time (e.g., "what is Sophiya's outtime and intime on 12-04-2025?")
    if (keywords.includes("intime") && keywords.includes("outtime")) {
      const record = attendanceRecords[0];
      const inTime = record.inTime || "Not recorded";
      const outTime = record.outTime || "Not recorded";
      return {
        success: true,
        message: `${name || empcode}'s in-time on ${dateStr} was ${inTime}, out-time was ${outTime}`
      };
    }

    // 9. Average out-time (e.g., "what is average outtime of 2334?")
    if (parsedQuery.averageOutTime && !parsedQuery.averageInTime) {
      const query: any = {
        empcode,
        empname: name,
        status: { $ne: "Absent" },
        outTime: { $ne: "00:00" }
      };
      if (
        parsedQuery.dateRange ||
        parsedQuery.dates?.[0] ||
        parsedQuery.timeRange === "last week"
      ) {
        query.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
      }
      const records = await findAttendancesByQuery(query);
      if (!records.length) {
        return {
          success: false,
          message: `${name || empcode} has no valid out-time records for ${dateStr}`
        };
      }
      const outTimes = records
        .map((r: any) => {
          const time = moment.utc(r.outTime, ["HH:mm:ss", "HH:mm"]);
          return time.isValid() ? time.hour() * 3600 + time.minute() * 60 + time.second() : NaN;
        })
        .filter((t: number) => !isNaN(t));
      const avgOutTime = outTimes.length
        ? moment
            .utc((outTimes.reduce((a: number, b: number) => a + b, 0) / outTimes.length) * 1000)
            .format("h:mm A")
        : "N/A";
      return {
        success: true,
        message: `${name || empcode}'s average out-time is ${avgOutTime} for ${dateStr}`
      };
    }

    // 10. Average in-time (e.g., "what is 2334 average intime?")
    if (parsedQuery.averageInTime && !parsedQuery.averageOutTime) {
      const query: any = {
        empcode,
        empname: name,
        status: { $ne: "Absent" },
        inTime: { $ne: "00:00" }
      };
      if (
        parsedQuery.dateRange ||
        parsedQuery.dates?.[0] ||
        parsedQuery.timeRange === "last week"
      ) {
        query.date = { $gte: startDate.toDate(), $lte: endDate.toDate() };
      }
      const records = await findAttendancesByQuery(query);
      if (!records.length) {
        return {
          success: false,
          message: `${name || empcode} has no valid in-time records for ${dateStr}`
        };
      }
      const inTimes = records
        .map((r: any) => {
          const time = moment.utc(r.inTime, ["HH:mm:ss", "HH:mm"]);
          return time.isValid() ? time.hour() * 3600 + time.minute() * 60 + time.second() : NaN;
        })
        .filter((t: number) => !isNaN(t));
      const avgInTime = inTimes.length
        ? moment
            .utc((inTimes.reduce((a: number, b: number) => a + b, 0) / inTimes.length) * 1000)
            .format("h:mm A")
        : "N/A";
      return {
        success: true,
        message: `${name || empcode}'s average in-time is ${avgInTime} for ${dateStr}`
      };
    }

    // 11. Out-time (e.g., "what is 2326 outtime on 12-04-2025?")
    if (keywords.includes("outtime") && !keywords.includes("intime")) {
      const record = attendanceRecords[0];
      if (!record.outTime) {
        return {
          success: false,
          message: `${name || empcode} has no out-time recorded on ${dateStr}`
        };
      }
      return {
        success: true,
        message: `${name || empcode}'s out-time on ${dateStr} was ${record.outTime}`
      };
    }

    // 12. In-time (e.g., "Supriya's intime on 12-04-2025")
    if (keywords.includes("intime") && !keywords.includes("outtime")) {
      const record = attendanceRecords[0];
      if (!record.inTime) {
        return {
          success: false,
          message: `${name || empcode} has no in-time recorded on ${dateStr}`
        };
      }
      return {
        success: true,
        message: `${name || empcode}'s in-time on ${dateStr} was ${record.inTime}`
      };
    }

    // Existing queries (e.g., after10am, latelogoff)
    if (keywords.includes("after10am")) {
      const record = attendanceRecords[0];
      if (!record.inTime) {
        return {
          success: false,
          message: `${name || empcode} has no in-time recorded on ${dateStr}`
        };
      }
      const inTime = moment(record.inTime, ["HH:mm:ss", "HH:mm"]);
      const isLate = inTime.isAfter(moment("10:00", "HH:mm"));
      return {
        success: true,
        message: `${name || empcode} ${isLate ? "logged in after 10:00 AM" : "did not log in after 10:00 AM"} on ${dateStr}`
      };
    }

    if (keywords.includes("latelogoff")) {
      const record = attendanceRecords[0];
      if (!record.outTime) {
        return {
          success: false,
          message: `${name || empcode} has no out-time recorded on ${dateStr}`
        };
      }
      const outTime = moment(record.outTime, ["HH:mm:ss", "HH:mm"]);
      const isLate = outTime.isAfter(moment("19:00", "HH:mm"));
      return {
        success: true,
        message: `${name || empcode} ${isLate ? "logged off after 7:00 PM" : "did not log off after 7:00 PM"} on ${dateStr}`
      };
    }

    console.log("No matching query handler");
    return {
      success: false,
      message: `Please specify a valid attendance query for ${name || empcode}`
    };
  } catch (error: any) {
    console.error("Error in processEmployeeQuery:", error.message, error.stack);
    return { success: false, message: `Failed to process query: ${error.message}` };
  }
};

export default {
  addAttendance,
  processQuery,
  processEmployeeQuery
};

import { ITimeSpentEntry } from "../../domain/model/task/timespent";
import { TIME_PERIODS, TIME_FORMAT, TIME_FORMAT_PATTERNS } from "../../constants/commonConstants/timeConstants";

const parseTimeString = (timeString: string): number => {
  if (!timeString) return 0;
  const days = parseInt(timeString.match(/(\d+)d/)?.[1] || "0", 10);
  const hours = parseInt(timeString.match(/(\d+)h/)?.[1] || "0", 10);
  return days * 8 + hours;
};

const parseHourMinuteString = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return ((hours || 0) * 60 + (minutes || 0)) / 60;
};

const formatHoursToTimeString = (totalHours: number): string => {
  const days = Math.floor(totalHours / 8);
  const hours = totalHours % 8;
  return `${days}d${hours}h`;
};

const calculateTotalTime = (timeEntries: ITimeSpentEntry[]): number => {
  return (timeEntries || []).reduce((total, entry) => {
    return total + parseTimeString(entry.time_logged);
  }, 0);
};

const calculateRemainingTime = (estimatedTime: string, spentTime: string): string => {
  const estimatedHours = parseTimeString(estimatedTime);
  const spentHours = parseTimeString(spentTime);
  return formatHoursToTimeString(Math.max(0, estimatedHours - spentHours));
};

const isValidTimeFormat = (timeString: string): boolean => {
  return TIME_FORMAT_PATTERNS.DAY_HOUR_FORMAT.test(timeString) && timeString.length > 0;
};

const calculateTimeLoggedFromStartEnd = (startTime: string, endTime: string): string => {
  try {
    let startHour: number;
    let startMinute: number;
    let endHour: number;
    let endMinute: number;

    // Parse time in HH:MM format or H:MM AM/PM format using imported regex patterns
    if (
      TIME_FORMAT_PATTERNS.ANY_TIME_FORMAT.test(startTime) &&
      TIME_FORMAT_PATTERNS.ANY_TIME_FORMAT.test(endTime)
    ) {
      // Check if time includes AM/PM indicator
      if (TIME_FORMAT_PATTERNS.AMPM_TIME.test(startTime)) {
        // Parse 12-hour format with AM/PM
        const startParts = startTime.match(TIME_FORMAT_PATTERNS.AMPM_PARTS);
        if (!startParts) throw new Error("Invalid start time format");

        startHour = parseInt(startParts[1], 10);
        startMinute = parseInt(startParts[2], 10);

        // Convert to 24-hour format using constants from timeConstants
        if (startParts[3].toUpperCase() === TIME_PERIODS.PM && startHour < TIME_FORMAT.NOON_HOUR) {
          startHour += TIME_FORMAT.NOON_HOUR;
        } else if (
          startParts[3].toUpperCase() === TIME_PERIODS.AM &&
          startHour === TIME_FORMAT.NOON_HOUR
        ) {
          startHour = 0;
        }
      } else {
        // Parse 24-hour format
        [startHour, startMinute] = startTime.split(":").map(Number);
      }

      if (TIME_FORMAT_PATTERNS.AMPM_TIME.test(endTime)) {
        // Parse 12-hour format with AM/PM
        const endParts = endTime.match(TIME_FORMAT_PATTERNS.AMPM_PARTS);
        if (!endParts) throw new Error("Invalid end time format");

        endHour = parseInt(endParts[1], 10);
        endMinute = parseInt(endParts[2], 10);

        // Convert to 24-hour format using constants from timeConstants
        if (endParts[3].toUpperCase() === TIME_PERIODS.PM && endHour < TIME_FORMAT.NOON_HOUR) {
          endHour += TIME_FORMAT.NOON_HOUR;
        } else if (
          endParts[3].toUpperCase() === TIME_PERIODS.AM &&
          endHour === TIME_FORMAT.NOON_HOUR
        ) {
          endHour = 0;
        }
      } else {
        // Parse 24-hour format
        [endHour, endMinute] = endTime.split(":").map(Number);
      }
    } else {
      throw new Error("Invalid time format. Use HH:MM or H:MM AM/PM format");
    }

    // Validate hour and minute ranges
    if (
      startHour < 0 ||
      startHour > 23 ||
      startMinute < 0 ||
      startMinute > 59 ||
      endHour < 0 ||
      endHour > 23 ||
      endMinute < 0 ||
      endMinute > 59
    ) {
      throw new Error("Hours must be 0-23 and minutes 0-59");
    }

    // Calculate minutes using constant from timeConstants
    const startMinutes = startHour * TIME_FORMAT.MINUTES_PER_HOUR + startMinute;
    const endMinutes = endHour * TIME_FORMAT.MINUTES_PER_HOUR + endMinute;

    // Ensure end time is after start time
    if (endMinutes <= startMinutes) {
      throw new Error("End time must be after start time");
    }

    // Calculate total hours using constant from timeConstants
    const totalHours = (endMinutes - startMinutes) / TIME_FORMAT.MINUTES_PER_HOUR;

    // Format as days and hours (1d = 8h)
    return formatHoursToTimeString(totalHours);
  } catch (error: unknown) {
    throw new Error(
      `Failed to calculate time logged: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const TimeUtil = {
  parseTimeString,
  parseHourMinuteString,
  formatHoursToTimeString,
  calculateTotalTime,
  calculateRemainingTime,
  isValidTimeFormat,
  calculateTimeLoggedFromStartEnd
};

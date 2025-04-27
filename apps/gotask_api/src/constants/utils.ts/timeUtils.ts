import { ITimeSpentEntry } from "../../domain/model/task/timespent";
import {
  TIME_PERIODS,
  TIME_FORMAT,
  TIME_FORMAT_PATTERNS
} from "../../constants/commonConstants/timeConstants";

// Parse "2d4h" format to total hours
const parseTimeString = (timeString: string): number => {
  if (!timeString) return 0;
  const days = parseInt(timeString.match(/(\d+)d/)?.[1] || "0", 10);
  const hours = parseInt(timeString.match(/(\d+)h/)?.[1] || "0", 10);
  return days * 8 + hours;
};

// Parse "HH:MM" string to total hours
const parseHourMinuteString = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return ((hours || 0) * 60 + (minutes || 0)) / 60;
};

// Format total hours to "XdYh" format
const formatHoursToTimeString = (totalHours: number): string => {
  const days = Math.floor(Math.abs(totalHours) / 8);
  const hours = Math.round(Math.abs(totalHours) % 8);
  const sign = totalHours < 0 ? "-" : "";
  return `${sign}${days}d${hours}h`;
};

// Calculate total time spent from array
const calculateTotalTime = (timeEntries: ITimeSpentEntry[]): number => {
  return (timeEntries || []).reduce((total, entry) => {
    return total + parseTimeString(entry.time_logged);
  }, 0);
};

// Calculate remaining time (Estimated - Spent)
const calculateRemainingTime = (estimatedTime: string, spentTime: string): string => {
  const estimatedHours = parseTimeString(estimatedTime);
  const spentHours = parseTimeString(spentTime);
  return formatHoursToTimeString(Math.max(0, estimatedHours - spentHours));
};

// Validate time format
const isValidTimeFormat = (timeString: string): boolean => {
  return TIME_FORMAT_PATTERNS.DAY_HOUR_FORMAT.test(timeString) && timeString.length > 0;
};

// Calculate time logged between start and end
const calculateTimeLoggedFromStartEnd = (startTime: string, endTime: string): string => {
  try {
    let startHour: number, startMinute: number, endHour: number, endMinute: number;

    if (
      TIME_FORMAT_PATTERNS.ANY_TIME_FORMAT.test(startTime) &&
      TIME_FORMAT_PATTERNS.ANY_TIME_FORMAT.test(endTime)
    ) {
      if (TIME_FORMAT_PATTERNS.AMPM_TIME.test(startTime)) {
        const startParts = startTime.match(TIME_FORMAT_PATTERNS.AMPM_PARTS);
        if (!startParts) throw new Error("Invalid start time format");
        startHour = parseInt(startParts[1], 10);
        startMinute = parseInt(startParts[2], 10);
        if (startParts[3].toUpperCase() === TIME_PERIODS.PM && startHour < TIME_FORMAT.NOON_HOUR) {
          startHour += TIME_FORMAT.NOON_HOUR;
        } else if (startParts[3].toUpperCase() === TIME_PERIODS.AM && startHour === TIME_FORMAT.NOON_HOUR) {
          startHour = 0;
        }
      } else {
        [startHour, startMinute] = startTime.split(":").map(Number);
      }

      if (TIME_FORMAT_PATTERNS.AMPM_TIME.test(endTime)) {
        const endParts = endTime.match(TIME_FORMAT_PATTERNS.AMPM_PARTS);
        if (!endParts) throw new Error("Invalid end time format");
        endHour = parseInt(endParts[1], 10);
        endMinute = parseInt(endParts[2], 10);
        if (endParts[3].toUpperCase() === TIME_PERIODS.PM && endHour < TIME_FORMAT.NOON_HOUR) {
          endHour += TIME_FORMAT.NOON_HOUR;
        } else if (endParts[3].toUpperCase() === TIME_PERIODS.AM && endHour === TIME_FORMAT.NOON_HOUR) {
          endHour = 0;
        }
      } else {
        [endHour, endMinute] = endTime.split(":").map(Number);
      }
    } else {
      throw new Error("Invalid time format. Use HH:MM or H:MM AM/PM format");
    }

    if (
      startHour < 0 || startHour > 23 ||
      startMinute < 0 || startMinute > 59 ||
      endHour < 0 || endHour > 23 ||
      endMinute < 0 || endMinute > 59
    ) {
      throw new Error("Hours must be 0-23 and minutes 0-59");
    }

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (endMinutes <= startMinutes) {
      throw new Error("End time must be after start time");
    }

    const totalHours = (endMinutes - startMinutes) / 60;
    return formatHoursToTimeString(totalHours);
  } catch (error: unknown) {
    throw new Error(`Failed to calculate time logged: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};

// Calculate variation (Spent - Estimated) including negative sign
const calculateVariation = (estimatedTime: string, actualSpentTime: string): string => {
  const estimatedHours = parseTimeString(estimatedTime);
  const actualSpentHours = parseTimeString(actualSpentTime);

  const variationInHours = actualSpentHours - estimatedHours; // allow negative values
  return formatHoursToTimeString(variationInHours);
};

export const TimeUtil = {
  parseTimeString,
  parseHourMinuteString,
  formatHoursToTimeString,
  calculateTotalTime,
  calculateRemainingTime,
  isValidTimeFormat,
  calculateTimeLoggedFromStartEnd,
  calculateVariation
};
